from flask import Flask
from dotenv import load_dotenv
from src.routes.api_routes import api_bp
from config import Config

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Register blueprints
app.register_blueprint(api_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)