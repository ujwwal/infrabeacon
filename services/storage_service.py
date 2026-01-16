"""
Cloud Storage Service for InfraBeacon

Handles image upload and storage in Google Cloud Storage.
"""

import os
import logging
import uuid
from datetime import datetime
from typing import Optional, Tuple
import base64

# Google Cloud Storage
try:
    from google.cloud import storage
    from google.oauth2 import service_account
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False

logger = logging.getLogger(__name__)


class StorageService:
    """Service class for Google Cloud Storage operations."""
    
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
    
    def __init__(self):
        """Initialize GCS client."""
        self.bucket_name = (
            os.environ.get('GCS_BUCKET')
            or os.environ.get('FIREBASE_STORAGE_BUCKET')
            or 'infrabeacon-images'
        )
        
        if GCS_AVAILABLE:
            try:
                project_id = os.environ.get('GOOGLE_CLOUD_PROJECT')
                
                # Try to create credentials from environment variables
                creds = None
                private_key = os.environ.get('FIREBASE_PRIVATE_KEY')
                client_email = os.environ.get('FIREBASE_CLIENT_EMAIL')
                
                if private_key and client_email and project_id:
                    # Check for placeholder values
                    if "firebase-adminsdk-xxx" in client_email:
                        logger.warning("Using placeholder credentials - skipping explicit creds initialization")
                    else:
                        if '\\n' in private_key:
                            private_key = private_key.replace('\\n', '\n')
                        
                        creds_dict = {
                            "type": "service_account",
                            "project_id": project_id,
                            "private_key": private_key,
                            "client_email": client_email,
                            "token_uri": "https://oauth2.googleapis.com/token",
                        }
                        creds = service_account.Credentials.from_service_account_info(creds_dict)
                        logger.info("Using credentials from environment variables")

                if project_id:
                    self.client = storage.Client(project=project_id, credentials=creds)
                else:
                    self.client = storage.Client(credentials=creds)
                self.bucket = self.client.bucket(self.bucket_name)
                self.enabled = True
                logger.info(f"GCS client initialized for bucket: {self.bucket_name}")
            except Exception as e:
                logger.warning(f"Failed to initialize GCS: {e}")
                self.client = None
                self.bucket = None
                self.enabled = False
        else:
            logger.warning("GCS not available - using mock mode")
            self.client = None
            self.bucket = None
            self.enabled = False
        
        # Mock storage for development
        self._mock_files = {}
    
    def _allowed_file(self, filename: str) -> bool:
        """Check if file extension is allowed."""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS
    
    def _generate_filename(self, original_filename: str) -> str:
        """Generate a unique filename for storage."""
        ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        unique_id = uuid.uuid4().hex[:8]
        return f"reports/{timestamp}_{unique_id}.{ext}"
    
    def upload_image(self, file_data: bytes, original_filename: str, 
                     content_type: Optional[str] = None) -> Tuple[bool, str]:
        """
        Upload an image to Cloud Storage.
        
        Args:
            file_data: Binary image data
            original_filename: Original filename for extension detection
            content_type: MIME type of the file
        
        Returns:
            Tuple of (success, url_or_error_message)
        """
        # Validate file extension
        if not self._allowed_file(original_filename):
            return False, "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"
        
        # Validate file size
        if len(file_data) > self.MAX_FILE_SIZE:
            return False, "File too large. Maximum size: 16MB"
        
        # Generate unique filename
        blob_name = self._generate_filename(original_filename)
        
        if self.enabled and self.bucket:
            try:
                blob = self.bucket.blob(blob_name)
                
                # Set content type
                if content_type:
                    blob.content_type = content_type
                else:
                    ext = original_filename.rsplit('.', 1)[1].lower()
                    content_types = {
                        'jpg': 'image/jpeg',
                        'jpeg': 'image/jpeg',
                        'png': 'image/png',
                        'gif': 'image/gif',
                        'webp': 'image/webp'
                    }
                    blob.content_type = content_types.get(ext, 'image/jpeg')
                
                # Upload
                blob.upload_from_string(file_data, content_type=blob.content_type)
                
                # Generate a signed URL for secure access (valid for 7 days)
                # For production, consider shorter expiration or using Firebase Storage
                from datetime import timedelta
                signed_url = blob.generate_signed_url(
                    version="v4",
                    expiration=timedelta(days=7),
                    method="GET"
                )
                
                public_url = signed_url
                logger.info(f"Uploaded image to: {public_url}")
                return True, public_url
                
            except Exception as e:
                logger.error(f"Failed to upload image: {e}")
                return False, f"Upload failed: {str(e)}"
        else:
            # Mock mode - store as base64 data URL
            try:
                ext = original_filename.rsplit('.', 1)[1].lower()
                content_types = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp'
                }
                mime_type = content_types.get(ext, 'image/jpeg')
                
                # Store and return a mock URL
                mock_id = uuid.uuid4().hex[:8]
                self._mock_files[mock_id] = {
                    'data': file_data,
                    'content_type': mime_type,
                    'filename': blob_name
                }
                
                # Return a data URL for immediate display
                b64_data = base64.b64encode(file_data).decode('utf-8')
                data_url = f"data:{mime_type};base64,{b64_data}"
                
                logger.info(f"Created mock image with ID: {mock_id}")
                return True, data_url
                
            except Exception as e:
                logger.error(f"Mock upload failed: {e}")
                return False, f"Upload failed: {str(e)}"
    
    def upload_from_base64(self, base64_data: str, 
                           filename: str = "upload.jpg") -> Tuple[bool, str]:
        """
        Upload an image from base64-encoded data.
        
        Args:
            base64_data: Base64-encoded image data (with or without data URL prefix)
            filename: Optional filename for extension detection
        
        Returns:
            Tuple of (success, url_or_error_message)
        """
        try:
            # Remove data URL prefix if present
            if ',' in base64_data:
                # Format: data:image/jpeg;base64,/9j/4AAQ...
                header, base64_data = base64_data.split(',', 1)
                # Extract content type from header
                if 'image/png' in header:
                    filename = "upload.png"
                elif 'image/gif' in header:
                    filename = "upload.gif"
                elif 'image/webp' in header:
                    filename = "upload.webp"
            
            # Decode base64
            file_data = base64.b64decode(base64_data)
            
            # Get content type from filename
            ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'jpg'
            content_types = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp'
            }
            content_type = content_types.get(ext, 'image/jpeg')
            
            return self.upload_image(file_data, filename, content_type)
            
        except Exception as e:
            logger.error(f"Failed to decode base64 image: {e}")
            return False, f"Invalid image data: {str(e)}"
    
    def delete_image(self, image_url: str) -> bool:
        """
        Delete an image from Cloud Storage.
        
        Args:
            image_url: The public URL of the image
        
        Returns:
            True if successful, False otherwise
        """
        if not self.enabled or not self.bucket:
            return True  # Mock mode - always succeed
        
        try:
            # Extract blob name from URL
            # URL format: https://storage.googleapis.com/bucket-name/blob-name
            blob_name = image_url.split(f'{self.bucket_name}/')[-1]
            blob = self.bucket.blob(blob_name)
            blob.delete()
            logger.info(f"Deleted image: {blob_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete image: {e}")
            return False


# Singleton instance
_storage_service = None


def get_storage_service() -> StorageService:
    """Get or create the Storage service singleton."""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
