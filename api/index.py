"""
Vercel serverless function entry point for Flask app.
"""
from app import app

# Export the Flask app for Vercel
# Vercel expects 'app' to be the WSGI application
