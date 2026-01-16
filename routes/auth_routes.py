"""
Authentication Routes for InfraBeacon

Handles admin login/logout using Firebase Authentication.
"""

import logging
from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session, current_app

from services.auth_service import get_auth_service

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login')
def login():
    """Render the admin login page."""
    # If already logged in, redirect to admin
    if session.get('admin_logged_in'):
        return redirect(url_for('admin.admin_dashboard'))
    
    return render_template('login.html',
                          firebase_api_key=current_app.config.get('FIREBASE_API_KEY', ''),
                          firebase_auth_domain=current_app.config.get('FIREBASE_AUTH_DOMAIN', ''),
                          firebase_project_id=current_app.config.get('GOOGLE_CLOUD_PROJECT', ''),
                          firebase_storage_bucket=current_app.config.get('FIREBASE_STORAGE_BUCKET', ''),
                          firebase_messaging_sender_id=current_app.config.get('FIREBASE_MESSAGING_SENDER_ID', ''),
                          firebase_app_id=current_app.config.get('FIREBASE_APP_ID', ''))


@auth_bp.route('/api/verify-token', methods=['POST'])
def verify_token():
    """
    Verify Firebase ID token and create session.
    
    Body:
    - id_token: Firebase ID token from client-side authentication
    """
    try:
        data = request.get_json()
        if not data or not data.get('id_token'):
            return jsonify({'error': 'ID token is required'}), 400
        
        auth_service = get_auth_service()
        
        # Verify the token
        decoded_token = auth_service.verify_id_token(data['id_token'])
        
        if not decoded_token:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        email = decoded_token.get('email', '')
        
        # Check if user is an admin
        if not auth_service.is_admin_email(email):
            return jsonify({'error': 'Access denied. You are not authorized as an admin.'}), 403
        
        # Create session
        session['admin_logged_in'] = True
        session['admin_email'] = email
        session['admin_uid'] = decoded_token.get('uid', '')
        # Safely extract name from token or email
        admin_name = decoded_token.get('name', '')
        if not admin_name and email and '@' in email:
            admin_name = email.split('@')[0]
        session['admin_name'] = admin_name or 'Admin'
        
        # Get redirect URL
        next_url = session.pop('next_url', None) or url_for('admin.admin_dashboard')
        
        logger.info(f"Admin login successful: {email}")
        
        return jsonify({
            'success': True,
            'redirect_url': next_url,
            'user': {
                'email': email,
                'name': session['admin_name']
            }
        })
    
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return jsonify({'error': 'Authentication failed'}), 500


@auth_bp.route('/logout')
def logout():
    """Log out the admin user."""
    email = session.get('admin_email', 'Unknown')
    
    # Clear session
    session.pop('admin_logged_in', None)
    session.pop('admin_email', None)
    session.pop('admin_uid', None)
    session.pop('admin_name', None)
    
    logger.info(f"Admin logout: {email}")
    
    return redirect(url_for('report.index'))


@auth_bp.route('/api/session')
def check_session():
    """Check if user is logged in."""
    if session.get('admin_logged_in'):
        return jsonify({
            'logged_in': True,
            'user': {
                'email': session.get('admin_email'),
                'name': session.get('admin_name')
            }
        })
    return jsonify({'logged_in': False})
