"""
Admin Routes for InfraBeacon

Handles admin/authority dashboard endpoints:
- View all reports
- Update report status
- Filter and manage reports

All routes are protected with authentication.
"""

import logging
from flask import Blueprint, request, jsonify, render_template, current_app, session

from services.firestore_service import get_firestore_service
from services.storage_service import get_storage_service
from services.auth_service import login_required

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/')
@login_required
def admin_dashboard():
    """Render the admin dashboard page."""
    return render_template('admin.html',
                          maps_api_key=current_app.config.get('GOOGLE_MAPS_API_KEY', ''),
                          admin_name=session.get('admin_name', 'Admin'),
                          admin_email=session.get('admin_email', ''))


@admin_bp.route('/api/reports', methods=['GET'])
@login_required
def get_all_reports():
    """
    Get all reports for admin view with full details.
    
    Query parameters:
    - status: Filter by status
    - issue_type: Filter by issue type
    - severity: Filter by severity
    - page: Page number (for pagination)
    - limit: Reports per page
    """
    try:
        firestore = get_firestore_service()
        
        status = request.args.get('status')
        issue_type = request.args.get('issue_type')
        severity = request.args.get('severity')
        limit = int(request.args.get('limit', 50))
        
        reports = firestore.get_all_reports(
            status=status,
            issue_type=issue_type,
            severity=severity,
            limit=limit
        )
        
        # Convert datetime objects and add extra info
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
        logger.error(f"Failed to get admin reports: {e}")
        return jsonify({'error': 'Failed to get reports'}), 500


@admin_bp.route('/api/reports/<report_id>', methods=['PATCH'])
@login_required
def update_report(report_id):
    """
    Update a report's status or other fields.
    
    Body:
    - status: New status (new, verified, resolved)
    - notes: Admin notes
    """
    try:
        firestore = get_firestore_service()
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Allowed fields for update
        allowed_fields = ['status', 'notes', 'severity', 'issue_type']
        updates = {}
        
        for field in allowed_fields:
            if field in data:
                updates[field] = data[field]
        
        if not updates:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Validate status
        if 'status' in updates:
            valid_statuses = ['new', 'verified', 'resolved']
            if updates['status'] not in valid_statuses:
                return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        # Validate severity
        if 'severity' in updates:
            valid_severities = ['low', 'medium', 'high']
            if updates['severity'] not in valid_severities:
                return jsonify({'error': f'Invalid severity. Must be one of: {valid_severities}'}), 400
        
        success = firestore.update_report(report_id, updates)
        
        if success:
            # Get updated report
            report = firestore.get_report(report_id)
            if report:
                if 'created_at' in report:
                    report['created_at'] = report['created_at'].isoformat() if hasattr(report['created_at'], 'isoformat') else str(report['created_at'])
                if 'updated_at' in report:
                    report['updated_at'] = report['updated_at'].isoformat() if hasattr(report['updated_at'], 'isoformat') else str(report['updated_at'])
            
            logger.info(f"Updated report {report_id}: {updates}")
            return jsonify({
                'success': True,
                'report': report
            })
        else:
            return jsonify({'error': 'Failed to update report'}), 500
    
    except Exception as e:
        logger.error(f"Failed to update report {report_id}: {e}")
        return jsonify({'error': 'Failed to update report'}), 500


@admin_bp.route('/api/reports/<report_id>', methods=['DELETE'])
@login_required
def delete_report(report_id):
    """Delete a report (admin only)."""
    try:
        firestore = get_firestore_service()
        storage = get_storage_service()
        
        # Get report to find image URL
        report = firestore.get_report(report_id)
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Delete image from storage
        image_url = report.get('image_url')
        if image_url and not image_url.startswith('data:'):
            storage.delete_image(image_url)
        
        # Delete report from Firestore
        success = firestore.delete_report(report_id)
        
        if success:
            logger.info(f"Deleted report {report_id}")
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to delete report'}), 500
    
    except Exception as e:
        logger.error(f"Failed to delete report {report_id}: {e}")
        return jsonify({'error': 'Failed to delete report'}), 500


@admin_bp.route('/api/reports/<report_id>/resolve', methods=['POST'])
@login_required
def resolve_report(report_id):
    """Quick action to mark a report as resolved."""
    try:
        firestore = get_firestore_service()
        
        data = request.get_json() or {}
        notes = data.get('notes', 'Marked as resolved by admin')
        
        success = firestore.update_report(report_id, {
            'status': 'resolved',
            'resolution_notes': notes
        })
        
        if success:
            logger.info(f"Resolved report {report_id}")
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to resolve report'}), 500
    
    except Exception as e:
        logger.error(f"Failed to resolve report {report_id}: {e}")
        return jsonify({'error': 'Failed to resolve report'}), 500


@admin_bp.route('/api/reports/<report_id>/verify', methods=['POST'])
@login_required
def verify_report(report_id):
    """Quick action to mark a report as verified."""
    try:
        firestore = get_firestore_service()
        
        success = firestore.update_report(report_id, {
            'status': 'verified'
        })
        
        if success:
            logger.info(f"Verified report {report_id}")
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to verify report'}), 500
    
    except Exception as e:
        logger.error(f"Failed to verify report {report_id}: {e}")
        return jsonify({'error': 'Failed to verify report'}), 500


@admin_bp.route('/api/bulk/update', methods=['POST'])
@login_required
def bulk_update_reports():
    """
    Bulk update multiple reports.
    
    Body:
    - report_ids: List of report IDs
    - updates: Fields to update
    """
    try:
        firestore = get_firestore_service()
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        report_ids = data.get('report_ids', [])
        updates = data.get('updates', {})
        
        if not report_ids:
            return jsonify({'error': 'No report IDs provided'}), 400
        if not updates:
            return jsonify({'error': 'No updates provided'}), 400
        
        # Allowed fields
        allowed_fields = ['status', 'severity']
        filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
        
        if not filtered_updates:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Update each report
        success_count = 0
        failed_ids = []
        
        for report_id in report_ids:
            if firestore.update_report(report_id, filtered_updates):
                success_count += 1
            else:
                failed_ids.append(report_id)
        
        logger.info(f"Bulk updated {success_count}/{len(report_ids)} reports")
        
        return jsonify({
            'success': True,
            'updated_count': success_count,
            'failed_ids': failed_ids
        })
    
    except Exception as e:
        logger.error(f"Failed to bulk update reports: {e}")
        return jsonify({'error': 'Failed to bulk update reports'}), 500
