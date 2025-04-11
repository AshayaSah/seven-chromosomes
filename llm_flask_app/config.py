import os
from flask import Blueprint
from src.utils.logger import setup_logger

REDIS_HISTORY_URL = "redis://localhost:6379/1"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DEBUG = bool(os.getenv("APP_DEBUGING"))
HOST = "0.0.0.0"
USER_AGENT = os.getenv("USER_AGENT")

api_bp = Blueprint("api", __name__)
logger = setup_logger()
