import os

class Config:
    REDIS_HISTORY_URL = os.getenv("REDIS_HISTORY_URL", "redis://localhost:6379/1")
    USER_AGENT = os.getenv("USER_AGENT")
    DEBUG = os.getenv("APP_DEBUGING")
    HOST = os.getenv("APP_HOST" ,"0.0.0.0") 
    PORT = os.getenv("APP_PORT", 5000)