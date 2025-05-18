import mysql.connector
from flask import g, current_app


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = mysql.connector.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DB']
        )
    return db

def close_db(e=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()