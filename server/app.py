from flask import Flask
from flask_cors import CORS
from routes import api_bp  # Import the blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allows React to talk to Flask

    # Register the blueprint (connects routes.py)
    app.register_blueprint(api_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)