# app.py
from flask import Flask
from src.routes.api_routes import api_bp
from config import Config
from src.utils.logger import setup_logger
import os
def create_app():
    app = Flask(__name__)
    os.environ["USER_AGENT"] = Config.USER_AGENT
    
    # Set up logging
    logger = setup_logger()
    logger.info("Starting LLM Flask application")
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=Config.DEBUG, host=Config.HOST, port=Config.PORT)
