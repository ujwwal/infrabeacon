"""
Firestore Service for InfraBeacon

Handles all database operations for infrastructure reports.
Uses Google Cloud Firestore for data storage.

Firestore Schema:
-----------------
Collection: reports
Document fields:
  - id: string (auto-generated)
  - image_url: string (GCS URL)
  - latitude: float
  - longitude: float
  - geohash: string (for geo-queries)
  - issue_type: string (pothole, broken_light, garbage, waterlogging, other)
  - severity: string (low, medium, high)
  - description: string (AI-generated or user-provided)
  - status: string (new, verified, resolved)
  - created_at: timestamp
  - updated_at: timestamp
  - duplicate_of: string (optional, reference to original report)
"""

import os
import logging
from datetime import datetime
from typing import Optional
import math

# Google Cloud Firestore
try:
    from google.cloud import firestore
    try:
        from google.cloud.firestore import FieldFilter
    except ImportError:
        FieldFilter = None
    FIRESTORE_AVAILABLE = True
except ImportError:
    FIRESTORE_AVAILABLE = False
    FieldFilter = None

# Firebase Admin SDK (alternative for authentication)
try:
    import firebase_admin
    from firebase_admin import credentials, firestore as fb_firestore
    FIREBASE_ADMIN_AVAILABLE = True
except ImportError:
    FIREBASE_ADMIN_AVAILABLE = False

logger = logging.getLogger(__name__)


# Geohash characters for encoding
GEOHASH_CHARS = '0123456789bcdefghjkmnpqrstuvwxyz'


def encode_geohash(lat: float, lon: float, precision: int = 7) -> str:
    """
    Encode latitude and longitude into a geohash string.
    Used for efficient geo-proximity queries in Firestore.
    
    Args:
        lat: Latitude (-90 to 90)
        lon: Longitude (-180 to 180)
        precision: Number of characters in geohash (default 7, ~150m precision)
    
    Returns:
        Geohash string
    """
    lat_range = [-90.0, 90.0]
    lon_range = [-180.0, 180.0]
    geohash = []
    bits = [16, 8, 4, 2, 1]
    bit = 0
    ch = 0
    is_lon = True
    
    while len(geohash) < precision:
        if is_lon:
            mid = (lon_range[0] + lon_range[1]) / 2
            if lon >= mid:
                ch |= bits[bit]
                lon_range[0] = mid
            else:
                lon_range[1] = mid
        else:
            mid = (lat_range[0] + lat_range[1]) / 2
            if lat >= mid:
                ch |= bits[bit]
                lat_range[0] = mid
            else:
                lat_range[1] = mid
        
        is_lon = not is_lon
        bit += 1
        
        if bit == 5:
            geohash.append(GEOHASH_CHARS[ch])
            bit = 0
            ch = 0
    
    return ''.join(geohash)


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points using Haversine formula.
    
    Args:
        lat1, lon1: First point coordinates
        lat2, lon2: Second point coordinates
    
    Returns:
        Distance in meters
    """
    R = 6371000  # Earth's radius in meters
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


class FirestoreService:
    """Service class for Firestore operations."""
    
    def __init__(self):
        """Initialize Firestore client."""
        self.db = None
        self.enabled = False
        
        project_id = os.environ.get('GOOGLE_CLOUD_PROJECT')
        service_account_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        
        # Try Firebase Admin SDK first
        if FIREBASE_ADMIN_AVAILABLE:
            try:
                if not firebase_admin._apps:
                    cred = None
                    # Try file path from env var
                    if service_account_path and os.path.exists(service_account_path):
                        cred = credentials.Certificate(service_account_path)
                    
                    # Try individual env vars if not loaded from file
                    if not cred:
                        private_key = os.environ.get('FIREBASE_PRIVATE_KEY')
                        client_email = os.environ.get('FIREBASE_CLIENT_EMAIL')
                        
                        if private_key and client_email and project_id:
                            # Check for placeholder values
                            if "firebase-adminsdk-xxx" in client_email:
                                logger.warning("Using placeholder credentials - skipping explicit creds initialization")
                            else:
                                if '\\n' in private_key:
                                    private_key = private_key.replace('\\n', '\n')
                                
                                cred = credentials.Certificate({
                                    "type": "service_account",
                                    "project_id": project_id,
                                    "private_key": private_key,
                                    "client_email": client_email,
                                    "token_uri": "https://oauth2.googleapis.com/token",
                                })

                    if cred:
                        firebase_admin.initialize_app(cred, {'projectId': project_id})
                
                # If app is initialized (either just now or before), get the client
                if firebase_admin._apps:
                    self.db = fb_firestore.client()
                    self.enabled = True
                    logger.info("Firestore client initialized via Firebase Admin SDK")
            except Exception as e:
                logger.warning(f"Failed to initialize Firestore via Firebase Admin: {e}")
        
        # Fallback to Google Cloud Firestore (uses ADC)
        if not self.enabled and FIRESTORE_AVAILABLE:
            try:
                if project_id:
                    self.db = firestore.Client(project=project_id)
                else:
                    self.db = firestore.Client()
                self.enabled = True
                logger.info("Firestore client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Firestore: {e}")
                self.db = None
                self.enabled = False
        
        if not self.enabled:
            logger.warning("Firestore not available - using mock mode")
        
        # In-memory storage for development/testing
        self._mock_reports = {}
    
    def create_report(self, report_data: dict) -> str:
        """
        Create a new infrastructure report.
        
        Args:
            report_data: Dictionary containing report information
        
        Returns:
            Report ID
        """
        # Add timestamps and default values
        now = datetime.utcnow()
        report_data['created_at'] = now
        report_data['updated_at'] = now
        report_data['status'] = report_data.get('status', 'new')
        
        # Generate geohash for geo-queries
        if 'latitude' in report_data and 'longitude' in report_data:
            report_data['geohash'] = encode_geohash(
                report_data['latitude'],
                report_data['longitude']
            )
        
        if self.enabled and self.db:
            doc_ref = self.db.collection('reports').document()
            report_data['id'] = doc_ref.id
            doc_ref.set(report_data)
            logger.info(f"Created report with ID: {doc_ref.id}")
            return doc_ref.id
        else:
            # Mock mode for development
            import uuid
            report_id = str(uuid.uuid4())[:8]
            report_data['id'] = report_id
            self._mock_reports[report_id] = report_data
            logger.info(f"Created mock report with ID: {report_id}")
            return report_id
    
    def get_report(self, report_id: str) -> Optional[dict]:
        """
        Get a report by ID.
        
        Args:
            report_id: The report ID
        
        Returns:
            Report data or None if not found
        """
        if self.enabled and self.db:
            doc_ref = self.db.collection('reports').document(report_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        else:
            return self._mock_reports.get(report_id)
    
    def get_all_reports(self, status: Optional[str] = None, 
                        issue_type: Optional[str] = None,
                        severity: Optional[str] = None,
                        limit: int = 100) -> list:
        """
        Get all reports with optional filtering.
        
        Args:
            status: Filter by status
            issue_type: Filter by issue type
            severity: Filter by severity
            limit: Maximum number of reports to return
        
        Returns:
            List of reports
        """
        if self.enabled and self.db:
            query = self.db.collection('reports')
            
            if status:
                query = query.where('status', '==', status)
            if issue_type:
                query = query.where('issue_type', '==', issue_type)
            if severity:
                query = query.where('severity', '==', severity)
            
            query = query.order_by('created_at', direction=firestore.Query.DESCENDING)
            query = query.limit(limit)
            
            docs = query.stream()
            return [doc.to_dict() for doc in docs]
        else:
            # Mock mode
            reports = list(self._mock_reports.values())
            if status:
                reports = [r for r in reports if r.get('status') == status]
            if issue_type:
                reports = [r for r in reports if r.get('issue_type') == issue_type]
            if severity:
                reports = [r for r in reports if r.get('severity') == severity]
            return reports[:limit]
    
    def find_nearby_reports(self, lat: float, lon: float, 
                           radius_meters: float = 15.0,
                           status_filter: Optional[list] = None) -> list:
        """
        Find reports within a given radius of a location.
        Uses geohash prefix matching for efficient queries.
        
        Args:
            lat: Latitude
            lon: Longitude
            radius_meters: Search radius in meters (default 15m)
            status_filter: Optional list of statuses to include
        
        Returns:
            List of nearby reports with distance
        """
        # Get geohash prefix for the area (precision 5 = ~5km area)
        geohash_prefix = encode_geohash(lat, lon, precision=5)
        
        if self.enabled and self.db:
            # Query reports with matching geohash prefix
            query = self.db.collection('reports')
            if FieldFilter:
                query = query.where(filter=FieldFilter('geohash', '>=', geohash_prefix))
                query = query.where(filter=FieldFilter('geohash', '<', geohash_prefix + '\uffff'))
            else:
                query = query.where('geohash', '>=', geohash_prefix)
                query = query.where('geohash', '<', geohash_prefix + '\uffff')
            
            if status_filter:
                # Note: Firestore doesn't support IN with range queries
                # We'll filter in memory
                pass
            
            docs = query.stream()
            reports = [doc.to_dict() for doc in docs]
        else:
            # Mock mode
            reports = list(self._mock_reports.values())
        
        # Filter by exact distance and status
        nearby = []
        for report in reports:
            if status_filter and report.get('status') not in status_filter:
                continue
            
            distance = calculate_distance(
                lat, lon,
                report.get('latitude', 0),
                report.get('longitude', 0)
            )
            
            if distance <= radius_meters:
                report_copy = report.copy()
                report_copy['distance'] = distance
                nearby.append(report_copy)
        
        # Sort by distance
        nearby.sort(key=lambda x: x['distance'])
        return nearby
    
    def update_report(self, report_id: str, updates: dict) -> bool:
        """
        Update a report.
        
        Args:
            report_id: The report ID
            updates: Dictionary of fields to update
        
        Returns:
            True if successful, False otherwise
        """
        updates['updated_at'] = datetime.utcnow()
        
        if self.enabled and self.db:
            try:
                doc_ref = self.db.collection('reports').document(report_id)
                doc_ref.update(updates)
                logger.info(f"Updated report {report_id}")
                return True
            except Exception as e:
                logger.error(f"Failed to update report {report_id}: {e}")
                return False
        else:
            if report_id in self._mock_reports:
                self._mock_reports[report_id].update(updates)
                return True
            return False
    
    def delete_report(self, report_id: str) -> bool:
        """
        Delete a report.
        
        Args:
            report_id: The report ID
        
        Returns:
            True if successful, False otherwise
        """
        if self.enabled and self.db:
            try:
                doc_ref = self.db.collection('reports').document(report_id)
                doc_ref.delete()
                logger.info(f"Deleted report {report_id}")
                return True
            except Exception as e:
                logger.error(f"Failed to delete report {report_id}: {e}")
                return False
        else:
            if report_id in self._mock_reports:
                del self._mock_reports[report_id]
                return True
            return False
    
    def get_reports_for_heatmap(self, bounds: Optional[dict] = None) -> list:
        """
        Get report data optimized for heatmap visualization.
        
        Args:
            bounds: Optional geographic bounds {north, south, east, west}
        
        Returns:
            List of {lat, lng, weight} for heatmap
        """
        # Severity weights for heatmap
        severity_weights = {
            'high': 1.0,
            'medium': 0.6,
            'low': 0.3
        }
        
        reports = self.get_all_reports(limit=500)
        heatmap_data = []
        
        for report in reports:
            lat = report.get('latitude')
            lng = report.get('longitude')
            
            if lat is None or lng is None:
                continue
            
            # Apply bounds filter if provided
            if bounds:
                if (lat > bounds.get('north', 90) or 
                    lat < bounds.get('south', -90) or
                    lng > bounds.get('east', 180) or 
                    lng < bounds.get('west', -180)):
                    continue
            
            weight = severity_weights.get(report.get('severity', 'low'), 0.3)
            
            # Increase weight for unresolved issues
            if report.get('status') != 'resolved':
                weight *= 1.5
            
            heatmap_data.append({
                'lat': lat,
                'lng': lng,
                'weight': weight
            })
        
        return heatmap_data


# Singleton instance
_firestore_service = None


def get_firestore_service() -> FirestoreService:
    """Get or create the Firestore service singleton."""
    global _firestore_service
    if _firestore_service is None:
        _firestore_service = FirestoreService()
    return _firestore_service
