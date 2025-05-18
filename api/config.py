import os

class Config:
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'user')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'password')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'ualgcantina')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_default_secret_key_that_should_be_changed')