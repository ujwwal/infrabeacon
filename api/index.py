"""
Vercel serverless function entry point for Flask app.
"""
from app import app

# Vercel will use this as the handler
handler = app
