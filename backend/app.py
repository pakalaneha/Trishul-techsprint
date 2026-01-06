from flask import Flask, request
from flask_migrate import Migrate
from flask_cors import CORS
from backend.config import Config
from backend.models import db
from backend.routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    CORS(app) # Enable CORS for generic access
    
    # Register blueprints
    app.register_blueprint(main)
    
    @app.before_request
    def log_request_info():
        app.logger.debug('URL: %s', request.url)
        app.logger.debug('Method: %s', request.method)
        app.logger.debug('Body: %s', request.get_data())
        print(f">>> Request: {request.method} {request.path} | Remote: {request.remote_addr}")
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
