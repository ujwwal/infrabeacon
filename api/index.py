"""
Vercel serverless function entry point for Flask app.
"""
import sys
from pathlib import Path

# Add parent directory to path so we can import app
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

from app import app

# Export the Flask app for Vercel
# Vercel expects 'app' to be the WSGI application
