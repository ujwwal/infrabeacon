import logging
import os
from pathlib import Path
from flask import Flask, jsonify

try:
    from dotenv import load_dotenv
    DOTENV_AVAILABLE = True
except ImportError:
    DOTENV_AVAILABLE = False

from routes.report_routes import report_bp
from routes.map_routes import map_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp


def create_app() -> Flask:
    """Create and configure the Flask app."""
    if DOTENV_AVAILABLE:
        load_dotenv()

    # Get the base directory - use APP_BASE_DIR env var if set (Vercel), otherwise use file location
    base_dir = Path(os.environ.get('APP_BASE_DIR', Path(__file__).parent.absolute()))
    
    app = Flask(
        __name__,
        static_folder=str(base_dir / "static"),
        template_folder=str(base_dir / "templates"),
        static_url_path='/static'
    )

    # Basic configuration
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
    app.config["GOOGLE_CLOUD_PROJECT"] = os.environ.get("GOOGLE_CLOUD_PROJECT", "")
    app.config["GCS_BUCKET"] = os.environ.get("GCS_BUCKET", "")
    app.config["GOOGLE_MAPS_API_KEY"] = os.environ.get("GOOGLE_MAPS_API_KEY", "")
    app.config["GEMINI_API_KEY"] = os.environ.get("GEMINI_API_KEY", "")
    
    # Firebase configuration
    app.config["FIREBASE_API_KEY"] = os.environ.get("FIREBASE_API_KEY", "")
    app.config["FIREBASE_AUTH_DOMAIN"] = os.environ.get("FIREBASE_AUTH_DOMAIN", "")
    app.config["FIREBASE_STORAGE_BUCKET"] = os.environ.get("FIREBASE_STORAGE_BUCKET", "")
    app.config["FIREBASE_MESSAGING_SENDER_ID"] = os.environ.get("FIREBASE_MESSAGING_SENDER_ID", "")
    app.config["FIREBASE_APP_ID"] = os.environ.get("FIREBASE_APP_ID", "")

    # Logging
    logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))

    # Blueprints
    app.register_blueprint(report_bp)
    app.register_blueprint(map_bp, url_prefix="/map")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    # Health check
    @app.route("/healthz")
    def health_check():
        return jsonify({"status": "ok"})

    return app


app = create_app()


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    port = int(os.environ.get("PORT", "8080"))
    app.run(host="0.0.0.0", port=port, debug=debug)
