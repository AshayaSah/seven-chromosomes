from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from src.routes.content_routes import content_bp
from src.routes.history_routes import history_bp
from src.routes.medical_routes import medical_bp
from src.config import logger, HOST, DEBUG

load_dotenv()

def create_app():
    app = Flask(__name__)

    CORS(
        app,
        origins=["*"]     
    )

    app.register_blueprint(content_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")
    app.register_blueprint(medical_bp, url_prefix="/api")

    logger.info("Starting LLM Flask application")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=DEBUG, host=HOST)
