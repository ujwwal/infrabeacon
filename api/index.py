"""
Vercel serverless function entry point for Flask app.
"""
import os
import sys
from pathlib import Path

# Get the directory containing this file
current_dir = Path(__file__).parent.absolute()

# Add parent directory to path so we can import app
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

# Set environment variable to tell app.py where the base directory is
os.environ['APP_BASE_DIR'] = str(parent_dir)

from app import app

# Export the Flask app for Vercel
# Vercel expects 'app' to be the WSGI application
