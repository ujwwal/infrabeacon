"""
Report Routes for InfraBeacon

Handles infrastructure issue reporting endpoints:
- Submit new reports
- View report details
- Check for duplicates
"""

import base64
import logging
from flask import Blueprint, request, jsonify, render_template, current_app

from services.firestore_service import get_firestore_service
from services.storage_service import get_storage_service
from services.gemini_service import get_gemini_service

logger = logging.getLogger(__name__)

report_bp = Blueprint('report', __name__)


@report_bp.route('/')
def index():
    """Render the main landing page."""
    return render_template('index.html', 
                          maps_api_key=current_app.config.get('GOOGLE_MAPS_API_KEY', ''))


@report_bp.route('/report')
def report_page():
    """Render the report submission page."""
    return render_template('report.html',
                          maps_api_key=current_app.config.get('GOOGLE_MAPS_API_KEY', ''))


@report_bp.route('/api/analyze', methods=['POST'])
def analyze_image():
    """
    Analyze an image with AI without creating a report.
    This allows users to review and confirm the AI detection before submission.
    
    Expects JSON with:
    - image: Base64 image data
    
    Returns:
    - AI analysis results (issue_type, description, confidence)
    """
    try:
        gemini = get_gemini_service()
        
        data = request.get_json()
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'Image is required'}), 400
        
        # Decode base64 for analysis
        if ',' in image_data:
            image_bytes = base64.b64decode(image_data.split(',')[1])
        else:
            image_bytes = base64.b64decode(image_data)
        
        # Analyze image with Gemini AI
        analysis = gemini.analyze_image(image_bytes)
        
        return jsonify({
            'success': True,
            'analysis': {
                'issue_type': analysis.get('issue_type', 'other'),
                'description': analysis.get('description', ''),
                'confidence': analysis.get('confidence', 0),
                'ai_analyzed': analysis.get('ai_analyzed', False)
            }
        })
    
    except Exception as e:
        logger.error(f"Failed to analyze image: {e}")
        return jsonify({'error': 'Failed to analyze image'}), 500


@report_bp.route('/api/reports', methods=['POST'])
def create_report():
    """
    Create a new infrastructure report.
    
    Expects JSON or multipart form data with:
    - image: Base64 image data or file
    - latitude: float
    - longitude: float
    - description (optional): string
    - issue_type (optional): User-confirmed issue type (overrides AI detection)
    
    Returns:
    - Report data with AI analysis
    - Duplicate warning if similar report exists nearby
    """
    try:
        firestore = get_firestore_service()
        storage = get_storage_service()
        gemini = get_gemini_service()
        
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
            image_data = data.get('image')
            latitude = float(data.get('latitude', 0))
            longitude = float(data.get('longitude', 0))
            user_description = data.get('description', '')
            user_issue_type = data.get('issue_type')  # User-confirmed issue type
        else:
            # Form data
            image_data = None
            if 'image' in request.files:
                file = request.files['image']
                if file.filename:
                    image_data = file.read()
                    image_filename = file.filename
            elif 'image' in request.form:
                image_data = request.form.get('image')
            
            latitude = float(request.form.get('latitude', 0))
            longitude = float(request.form.get('longitude', 0))
            user_description = request.form.get('description', '')
            user_issue_type = request.form.get('issue_type')
        
        # Validate required fields
        if not image_data:
            return jsonify({'error': 'Image is required'}), 400
        
        if latitude == 0 and longitude == 0:
            return jsonify({'error': 'Location is required'}), 400
        
        # Check for nearby duplicate reports (within 15 meters)
        nearby_reports = firestore.find_nearby_reports(
            latitude, longitude,
            radius_meters=15.0,
            status_filter=['new', 'verified']
        )
        
        duplicate_warning = None
        potential_duplicate_id = None
        
        if nearby_reports:
            # Found nearby reports - potential duplicate
            closest = nearby_reports[0]
            duplicate_warning = {
                'message': f'Similar report found {closest["distance"]:.1f}m away',
                'existing_report': {
                    'id': closest.get('id'),
                    'issue_type': closest.get('issue_type'),
                    'status': closest.get('status'),
                    'distance': closest['distance']
                }
            }
            potential_duplicate_id = closest.get('id')
        
        # Upload image to storage
        if isinstance(image_data, bytes):
            # Binary data from file upload
            filename = image_filename if 'image_filename' in dir() else 'upload.jpg'
            success, image_url = storage.upload_image(image_data, filename)
        else:
            # Base64 data
            success, image_url = storage.upload_from_base64(image_data)
            # Decode for AI analysis
            if ',' in image_data:
                image_data = base64.b64decode(image_data.split(',')[1])
            else:
                image_data = base64.b64decode(image_data)
        
        if not success:
            return jsonify({'error': image_url}), 400
        
        # Analyze image with Gemini AI
        if isinstance(image_data, bytes):
            analysis = gemini.analyze_image(image_data)
        else:
            analysis = gemini.analyze_image_from_base64(image_data)
        
        # Use user-confirmed issue type if provided, otherwise use AI detection
        final_issue_type = user_issue_type if user_issue_type else analysis.get('issue_type', 'other')
        user_confirmed = user_issue_type is not None
        
        # Create report data
        report_data = {
            'image_url': image_url,
            'latitude': latitude,
            'longitude': longitude,
            'issue_type': final_issue_type,
            'severity': analysis.get('severity', 'medium'),
            'description': user_description or analysis.get('description', ''),
            'ai_description': analysis.get('description', ''),
            'ai_details': analysis.get('details', ''),
            'ai_confidence': analysis.get('confidence', 0),
            'ai_analyzed': analysis.get('ai_analyzed', False),
            'ai_issue_type': analysis.get('issue_type', 'other'),  # Store original AI detection
            'user_confirmed': user_confirmed  # Track if user confirmed/changed the type
        }
        
        # Mark as potential duplicate if found
        if potential_duplicate_id:
            report_data['potential_duplicate_of'] = potential_duplicate_id
        
        # Save to Firestore
        report_id = firestore.create_report(report_data)
        report_data['id'] = report_id
        
        # Prepare response
        response = {
            'success': True,
            'report': report_data,
            'analysis': {
                'issue_type': analysis.get('issue_type'),
                'severity': analysis.get('severity'),
                'confidence': analysis.get('confidence'),
                'description': analysis.get('description')
            }
        }
        
        if duplicate_warning:
            response['duplicate_warning'] = duplicate_warning
        
        logger.info(f"Created report {report_id}: {report_data['issue_type']} ({report_data['severity']}) - User confirmed: {user_confirmed}")
        return jsonify(response), 201
    
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Failed to create report: {e}")
        return jsonify({'error': 'Failed to create report'}), 500


@report_bp.route('/api/reports', methods=['GET'])
def get_reports():
    """
    Get all reports with optional filtering.
    
    Query parameters:
    - status: Filter by status (new, verified, resolved)
    - issue_type: Filter by issue type
    - severity: Filter by severity
    - limit: Maximum number of reports (default 100)
    """
    try:
        firestore = get_firestore_service()
        
        status = request.args.get('status')
        issue_type = request.args.get('issue_type')
        severity = request.args.get('severity')
        limit = int(request.args.get('limit', 100))
        
        reports = firestore.get_all_reports(
            status=status,
            issue_type=issue_type,
            severity=severity,
            limit=limit
        )
        
        # Convert datetime objects to strings for JSON serialization
        for report in reports:
            if 'created_at' in report:
                report['created_at'] = report['created_at'].isoformat() if hasattr(report['created_at'], 'isoformat') else str(report['created_at'])
            if 'updated_at' in report:
                report['updated_at'] = report['updated_at'].isoformat() if hasattr(report['updated_at'], 'isoformat') else str(report['updated_at'])
        
        return jsonify({
            'success': True,
            'reports': reports,
            'count': len(reports)
        })
    
    except Exception as e:
        logger.error(f"Failed to get reports: {e}")
        return jsonify({'error': 'Failed to get reports'}), 500


@report_bp.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get a specific report by ID."""
    try:
        firestore = get_firestore_service()
        report = firestore.get_report(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Convert datetime objects
        if 'created_at' in report:
            report['created_at'] = report['created_at'].isoformat() if hasattr(report['created_at'], 'isoformat') else str(report['created_at'])
        if 'updated_at' in report:
            report['updated_at'] = report['updated_at'].isoformat() if hasattr(report['updated_at'], 'isoformat') else str(report['updated_at'])
        
        return jsonify({
            'success': True,
            'report': report
        })
    
    except Exception as e:
        logger.error(f"Failed to get report {report_id}: {e}")
        return jsonify({'error': 'Failed to get report'}), 500


@report_bp.route('/api/reports/nearby', methods=['GET'])
def get_nearby_reports():
    """
    Get reports near a specific location.
    
    Query parameters:
    - lat: Latitude (required)
    - lng: Longitude (required)
    - radius: Search radius in meters (default 50)
    """
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 50))
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Location is required'}), 400
        
        firestore = get_firestore_service()
        reports = firestore.find_nearby_reports(lat, lng, radius)
        
        # Convert datetime objects
        for report in reports:
            if 'created_at' in report:
                report['created_at'] = report['created_at'].isoformat() if hasattr(report['created_at'], 'isoformat') else str(report['created_at'])
            if 'updated_at' in report:
                report['updated_at'] = report['updated_at'].isoformat() if hasattr(report['updated_at'], 'isoformat') else str(report['updated_at'])
        
        return jsonify({
            'success': True,
            'reports': reports,
            'count': len(reports),
            'center': {'lat': lat, 'lng': lng},
            'radius': radius
        })
    
    except ValueError as e:
        return jsonify({'error': 'Invalid coordinates'}), 400
    except Exception as e:
        logger.error(f"Failed to get nearby reports: {e}")
        return jsonify({'error': 'Failed to get nearby reports'}), 500
