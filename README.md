# UAlg Cantina Weekly Menu System

## Description
A system to manage and display the weekly menu for the UAlg cantina.

## Features
- Public weekly menu display
- Admin panel for managing menu items, dishes, and allergens
- User registration and authentication

## Technologies Used
- Backend: Flask (Python)
- Database: MySQL
- Frontend: Next.js (React)
- Containerization: Docker, Docker Compose

## Prerequisites
- Docker and Docker Compose installed

## Getting Started

### Cloning the Repository

# UAlg Cantina Weekly Menu System

## Description
A web application to display the weekly menu for the UAlg Cantina and allow administrators to manage menu items, dishes, and allergens.

## Getting Started

## Features
- Public view of the weekly menu with dish details (name, description, allergens).
- Admin login and authentication.
- CRUD operations for Dishes (Add, View, Edit, Delete).
- CRUD operations for Allergens (Add, View, Edit, Delete).
- CRUD operations for Weekly Menu Items (linking dishes to specific dates and days).
- Secure password hashing for admin users.
- Basic frontend structure using Jinja2 templates, includes, and static files (CSS, JS).
- Admin logout functionality.

## Project Structure
The project is organized into `backend` and `frontend` directories:

*   `backend/`: Contains the Flask application and backend logic.
    *   `app.py`: The main Flask application entry point.
    *   `routes.py`: Defines the different URL routes and their corresponding view functions using a Blueprint.
    *   `auth.py`: Handles authentication logic, including the login route and the `login_required` decorator.
    *   `models.py`: Contains functions for interacting with the database (SQLite).
    *   `database/`: Directory for database-related files.
        *   `cantina.db`: The SQLite database file (generated after setup).
        *   `create_db.py`: A script to create the database tables.
*   `frontend/`: Contains the static frontend files and Jinja2 templates.
    *   `templates/`: HTML templates rendered by Flask using Jinja2.
        *   `base.html`: The base template for the site layout.
        *   `index.html`: Template for the public menu page.
        *   `admin_login.html`: Template for the admin login page.
        *   `admin.html`: Template for the admin dashboard.
        *   `includes/`: Directory for reusable template partials.
            *   `header.html`: Template for the page header.
            *   `footer.html`: Template for the page footer.
            *   `nav_bar.html`: Template for the navigation bar.
    *   `static/`: Directory for static assets served directly by the web server.
        *   `css/`: Contains CSS files (`style.css`).
        *   `js/`: Contains JavaScript files (`index.js`, `admin.js`, `admin_login.js`).

## Setup
1.  Clone the repository (if applicable).
2.  Create a virtual environment: `python -m venv .venv`
3.  Activate the virtual environment:
    *   On macOS and Linux: `source .venv/bin/activate`
    *   On Windows: `.venv\Scripts\activate`
4.  Install dependencies. You'll need to create a `requirements.txt` file containing `Flask`, `Werkzeug`, and `Jinja2`.
