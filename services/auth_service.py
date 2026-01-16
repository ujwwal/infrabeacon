"""
Authentication Service for InfraBeacon

Handles admin authentication using Firebase Authentication.
Uses Firebase Admin SDK for server-side token verification.
"""

import os
import logging
from functools import wraps
from flask import session, redirect, url_for, request, current_app

# Firebase Admin SDK
try:
    import firebase_admin
    from firebase_admin import credentials, auth
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

logger = logging.getLogger(__name__)


class AuthService:
    """Service class for Firebase Authentication operations."""
    
    def __init__(self):
        """Initialize Firebase Admin SDK."""
        self.enabled = False
        
        if not FIREBASE_AVAILABLE:
            logger.warning("Firebase Admin SDK not available")
            return
        
        try:
            # Check if default app is already initialized
            self._app = firebase_admin.get_app('[DEFAULT]')
            self.enabled = True
            logger.info("Firebase already initialized")
        except ValueError:
            # Not initialized, try to initialize
            try:
                # Try to use application default credentials (for Cloud Run)
                # or service account credentials from environment
                cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
                if cred_path and os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                else:
                    # Use default credentials (works in GCP environments)
                    firebase_admin.initialize_app()
                
                self.enabled = True
                logger.info("Firebase Admin SDK initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Firebase: {e}")
                self.enabled = False
    
    def verify_id_token(self, id_token: str) -> dict:
        """
        Verify a Firebase ID token.
        
        Args:
            id_token: The Firebase ID token from the client
        
        Returns:
            Decoded token claims if valid, empty dict otherwise
        """
        if not self.enabled:
            logger.warning("Firebase not enabled, cannot verify token")
            return {}
        
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return {}
    
    def is_admin_email(self, email: str) -> bool:
        """
        Check if the email is allowed to access admin panel.
        
        For production, you would check against a list of admin emails
        stored in Firestore or environment variables.
        
        Args:
            email: User's email address
        
        Returns:
            True if user is an admin
        """
        # HACKATHON MVP: Allow anyone with a Google account to be admin
        # For production, uncomment the code below and set ADMIN_EMAILS env var
        return True
        
        # # Get admin emails from environment (comma-separated)
        # admin_emails = os.environ.get('ADMIN_EMAILS', '')
        # admin_list = [e.strip().lower() for e in admin_emails.split(',') if e.strip()]
        # 
        # # If no admin list is configured, deny access for security
        # if not admin_list:
        #     logger.warning("No ADMIN_EMAILS configured, denying access")
        #     return False
        # 
        # return email.lower() in admin_list


# Singleton instance
_auth_service = None


def get_auth_service() -> AuthService:
    """Get or create the Auth service singleton."""
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service


def login_required(f):
    """
    Decorator to require authentication for admin routes.
    Checks for a valid session with user information.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Disabled for Hackathon MVP - Allow everyone access
        # if not session.get('admin_logged_in'):
        #     # Store the original URL to redirect back after login
        #     session['next_url'] = request.url
        #     return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function
