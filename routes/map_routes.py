"""
Map Routes for InfraBeacon

Handles map visualization endpoints:
- Display all reports on map
- Generate heatmap data
- Geographic aggregation
"""

import logging
from flask import Blueprint, request, jsonify, render_template, current_app

from services.firestore_service import get_firestore_service

logger = logging.getLogger(__name__)

map_bp = Blueprint('map', __name__)


@map_bp.route('/')
def map_page():
    """Render the map visualization page."""
    return render_template('map.html',
                          maps_api_key=current_app.config.get('GOOGLE_MAPS_API_KEY', ''))


@map_bp.route('/api/markers')
def get_map_markers():
    """
    Get all reports as map markers.
    
    Query parameters:
    - status: Filter by status
    - issue_type: Filter by issue type
    - bounds: Geographic bounds (north,south,east,west)
    """
    try:
        firestore = get_firestore_service()
        
        status = request.args.get('status')
        issue_type = request.args.get('issue_type')
        
        reports = firestore.get_all_reports(
            status=status,
            issue_type=issue_type,
            limit=500
        )
        
        # Convert to marker format
        markers = []
        for report in reports:
            lat = report.get('latitude')
            lng = report.get('longitude')
            
            if lat is None or lng is None:
                continue
            
            # Icon color based on severity
            severity_colors = {
                'high': '#dc3545',    # Red
                'medium': '#ffc107',  # Yellow
                'low': '#28a745'      # Green
            }
            
            # Status icons
            status_icons = {
                'new': '🔴',
                'verified': '🟡',
                'resolved': '🟢'
            }
            
            markers.append({
                'id': report.get('id'),
                'lat': lat,
                'lng': lng,
                'issue_type': report.get('issue_type', 'other'),
                'severity': report.get('severity', 'medium'),
                'status': report.get('status', 'new'),
                'description': report.get('description', ''),
                'image_url': report.get('image_url', ''),
                'color': severity_colors.get(report.get('severity', 'medium'), '#ffc107'),
                'icon': status_icons.get(report.get('status', 'new'), '🔴'),
                'created_at': report.get('created_at').isoformat() if hasattr(report.get('created_at'), 'isoformat') else str(report.get('created_at', ''))
            })
        
        return jsonify({
            'success': True,
            'markers': markers,
            'count': len(markers)
        })
    
    except Exception as e:
        logger.error(f"Failed to get map markers: {e}")
        return jsonify({'error': 'Failed to get markers'}), 500


@map_bp.route('/api/heatmap')
def get_heatmap_data():
    """
    Get heatmap data for issue density visualization.
    
    Returns weighted points based on:
    - Issue severity
    - Issue status (unresolved issues weighted higher)
    """
    try:
        firestore = get_firestore_service()
        
        # Parse bounds if provided
        bounds = None
        bounds_param = request.args.get('bounds')
        if bounds_param:
            try:
                parts = bounds_param.split(',')
                if len(parts) == 4:
                    bounds = {
                        'north': float(parts[0]),
                        'south': float(parts[1]),
                        'east': float(parts[2]),
                        'west': float(parts[3])
                    }
            except ValueError:
                pass
        
        heatmap_data = firestore.get_reports_for_heatmap(bounds=bounds)
        
        return jsonify({
            'success': True,
            'data': heatmap_data,
            'count': len(heatmap_data)
        })
    
    except Exception as e:
        logger.error(f"Failed to get heatmap data: {e}")
        return jsonify({'error': 'Failed to get heatmap data'}), 500


@map_bp.route('/api/stats')
def get_stats():
    """
    Get statistics for the dashboard.
    
    Returns counts by:
    - Status
    - Issue type
    - Severity
    """
    try:
        firestore = get_firestore_service()
        
        # Get all reports for statistics
        reports = firestore.get_all_reports(limit=1000)
        
        # Calculate statistics
        stats = {
            'total': len(reports),
            'by_status': {
                'new': 0,
                'verified': 0,
                'resolved': 0
            },
            'by_type': {
                'pothole': 0,
                'broken_light': 0,
                'garbage': 0,
                'waterlogging': 0,
                'other': 0
            },
            'by_severity': {
                'high': 0,
                'medium': 0,
                'low': 0
            }
        }
        
        for report in reports:
            status = report.get('status', 'new')
            issue_type = report.get('issue_type', 'other')
            severity = report.get('severity', 'medium')
            
            if status in stats['by_status']:
                stats['by_status'][status] += 1
            if issue_type in stats['by_type']:
                stats['by_type'][issue_type] += 1
            if severity in stats['by_severity']:
                stats['by_severity'][severity] += 1
        
        return jsonify({
            'success': True,
            'stats': stats
        })
    
    except Exception as e:
        logger.error(f"Failed to get stats: {e}")
        return jsonify({'error': 'Failed to get stats'}), 500


@map_bp.route('/api/clusters')
def get_clusters():
    """
    Get clustered report data for map display.
    
    Query parameters:
    - zoom: Current map zoom level
    - bounds: Geographic bounds (north,south,east,west)
    
    Returns clusters for efficient map rendering at different zoom levels.
    """
    try:
        firestore = get_firestore_service()
        
        zoom = int(request.args.get('zoom', 10))
        
        reports = firestore.get_all_reports(limit=500)
        
        # Simple grid-based clustering
        # Grid size depends on zoom level
        grid_sizes = {
            range(0, 5): 5.0,     # Very zoomed out - 5 degree grid
            range(5, 8): 1.0,     # Zoomed out - 1 degree grid
            range(8, 11): 0.1,    # Medium zoom - 0.1 degree grid
            range(11, 14): 0.01,  # Zoomed in - 0.01 degree grid
            range(14, 20): 0.001  # Very zoomed in - 0.001 degree grid
        }
        
        grid_size = 0.01
        for zoom_range, size in grid_sizes.items():
            if zoom in zoom_range:
                grid_size = size
                break
        
        # Group reports into grid cells
        clusters = {}
        for report in reports:
            lat = report.get('latitude')
            lng = report.get('longitude')
            
            if lat is None or lng is None:
                continue
            
            # Calculate grid cell
            grid_lat = round(lat / grid_size) * grid_size
            grid_lng = round(lng / grid_size) * grid_size
            grid_key = f"{grid_lat},{grid_lng}"
            
            if grid_key not in clusters:
                clusters[grid_key] = {
                    'lat': grid_lat,
                    'lng': grid_lng,
                    'count': 0,
                    'reports': [],
                    'severity_sum': 0
                }
            
            severity_weights = {'high': 3, 'medium': 2, 'low': 1}
            clusters[grid_key]['count'] += 1
            clusters[grid_key]['reports'].append(report.get('id'))
            clusters[grid_key]['severity_sum'] += severity_weights.get(report.get('severity', 'medium'), 2)
        
        # Convert to list and calculate average severity
        cluster_list = []
        for cluster in clusters.values():
            avg_severity = cluster['severity_sum'] / cluster['count'] if cluster['count'] > 0 else 2
            cluster_list.append({
                'lat': cluster['lat'],
                'lng': cluster['lng'],
                'count': cluster['count'],
                'avg_severity': avg_severity,
                'report_ids': cluster['reports'][:10]  # Limit report IDs
            })
        
        return jsonify({
            'success': True,
            'clusters': cluster_list,
            'count': len(cluster_list),
            'zoom': zoom,
            'grid_size': grid_size
        })
    
    except Exception as e:
        logger.error(f"Failed to get clusters: {e}")
        return jsonify({'error': 'Failed to get clusters'}), 500


@map_bp.route('/api/image-proxy')
def proxy_image():
    """
    Proxy image requests to handle CORS issues with external image URLs.
    
    Query parameters:
    - url: The image URL to proxy
    """
    import requests
    from flask import Response
    
    image_url = request.args.get('url')
    if not image_url:
        return jsonify({'error': 'No URL provided'}), 400
    
    try:
        # Fetch the image
        response = requests.get(image_url, timeout=10, stream=True)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch image'}), response.status_code
        
        # Get content type
        content_type = response.headers.get('Content-Type', 'image/jpeg')
        
        # Return the image with proper headers
        return Response(
            response.content,
            mimetype=content_type,
            headers={
                'Cache-Control': 'public, max-age=86400',  # Cache for 1 day
                'Access-Control-Allow-Origin': '*'
            }
        )
    except Exception as e:
        logger.error(f"Image proxy error: {e}")
        return jsonify({'error': 'Failed to proxy image'}), 500
