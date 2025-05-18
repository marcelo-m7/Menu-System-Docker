# MySQL Database Service

## Description
This service provides the MySQL database for the UAlg Cantina Weekly Menu System.

## Dockerfile
The `Dockerfile` in this directory is used to build a custom MySQL image. It is based on the official MySQL image and copies the initialization script (`init.sql`) into the container.

## Initialization Script (`init.sql`)
The `init.sql` file contains SQL commands to set up the database and tables when the MySQL container is first created. It includes:
- Creating the `ualgcantina` database.
- Creating the `users`, `roles`, `user_roles`, `Pratos`, `Alergenos`, and `Ementas` tables with their respective columns and relationships.
- Inserting initial data (e.g., default user roles, an admin user).

## Configuration
Database configuration is managed through environment variables in the `docker-compose.yml` file, including `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD`.

## Accessing the Database
You can access the database using a MySQL client or tools like phpMyAdmin (configured in `docker-compose.yml` to be available at `http://localhost:8080`).

## Volumes
The `mysql_data` volume is used to persist the database data, ensuring data is not lost when the container is stopped or removed.