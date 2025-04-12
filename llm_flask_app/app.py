from flask import Flask
from flask_cors import CORS
from src.utils.logger import setup_logger
from src.routes.api_routes import api_bp
from src.config import USER_AGENT, HOST, DEBUG
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    # CORS(app)
    CORS(app, origins=["*"], 
        methods=["GET", "POST"], 
        allow_headers=["Content-Type", "Authorization"])
    logger = setup_logger()
    logger.info("Starting LLM Flask application")
    app.register_blueprint(api_bp, url_prefix="/api")
    return app


if __name__ == "__main__":
    app: Flask = create_app()
    USER_AGENT = USER_AGENT
    app.run(debug=DEBUG, host=HOST)