# app.py
import os
from dotenv import load_dotenv
from flask import Flask
from src.utils.logger import setup_logger
from src.routes.api_routes import api_bp
from config import Config

load_dotenv()




def create_app():
    app = Flask(__name__)
    logger = setup_logger()
    logger.info("Starting LLM Flask application")
    app.register_blueprint(api_bp, url_prefix="/api")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=Config.DEBUG, host=Config.HOST, port=Config.PORT)