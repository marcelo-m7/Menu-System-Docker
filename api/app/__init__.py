from flask import Flask
from . import models
from .config import Config

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    app.teardown_appcontext(models.close_db)

    # Register blueprints here later
    # from . import routes
    # app.register_blueprint(routes.bp)

    return app