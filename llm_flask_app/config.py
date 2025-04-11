import os

class Config:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyCPmJrgK2WL7tueEeK72VV0DMIEqG_SzFQ")
    REDIS_HISTORY_URL = os.getenv("REDIS_HISTORY_URL", "redis://localhost:6379/1")
    USER_AGENT = os.getenv(
        "USER_AGENT",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )
    DEBUG = os.getenv("APP_DEBUGING", "False").lower() == "true"  
    HOST = os.getenv("APP_HOST", "0.0.0.0") 
    PORT = int(os.getenv("APP_PORT", "5000"))

