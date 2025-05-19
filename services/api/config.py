import os

class Config:
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost') # Default value for development
    MYSQL_USER = os.environ.get('MYSQL_USER', 'user')     # Default value for development
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'password') # Default value for development
    MYSQL_DB = os.environ.get('MYSQL_DB', 'ualgcantina')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_default_secret_key_that_should_be_changed')