# Flask API Service

## Description
This service provides the RESTful API for the UAlg Cantina Weekly Menu System. It handles user authentication, management of menu items, dishes, and allergens, and serves the public weekly menu data.

## Technologies Used
- Flask
- Python
- MySQL Connector

## Dependencies
Project dependencies are listed in `requirements.txt`.

## File Structure
- `Dockerfile`: Defines the Docker image for the API.
- `requirements.txt`: Lists Python dependencies.
- `app/`:
  - `__init__.py`: Application factory and configuration.
  - `auth.py`: Authentication-related routes and logic (login, registration, role checking).
  - `models.py`: Database interaction logic (functions for CRUD operations).
  - `routes.py`: Defines the API endpoints for menu, admin management, etc.

## Configuration
API configuration, including database connection details and the secret key, is managed through environment variables (primarily via `docker-compose.yml` and potentially a `.env` file).

## API Endpoints
This section provides a brief overview of the API endpoints. For more detailed information, refer to the code within the `app/routes.py` file.

**Base URL:** The API is typically accessed at `/api`.

**Authentication:** Authentication is handled using session cookies after a successful login. Admin endpoints require a user with the 'admin' role.

### Authentication
- `POST /auth/register`
  - Description: Registers a new user.
  - Request Body: JSON with `username`, `email`, and `password`.
  - Response: Success or error message.
- `POST /auth/register_firebase`
  - Description: Registers a user with a Firebase UID (placeholder).
  - Request Body: JSON with `username`, `email`, `password`, and `firebase_uid`.
  - Response: Success or error message.
- `POST /auth/login`
  - Description: Authenticates a user.
  - Request Body: JSON with `username` or `email`, and `password`.
  - Response: Success message or error (e.g., 401 Unauthorized).
- `GET /admin/test`
  - Description: Test authenticated access (requires admin role).
  - Requires: Authentication (e.g., session cookie).
  - Response: Success message if authenticated as admin, 401/403 otherwise.

### Public Menu
- `GET /menu`
  - Description: Retrieves the current weekly menu.
  - Response: JSON array of menu items.

### Admin - Dishes
- `GET /admin/dishes`
  - Description: Get all dishes.
  - Requires: Admin authentication.
- `POST /admin/dishes`
  - Description: Add a new dish.
  - Requires: Admin authentication.
  - Request Body: JSON with dish details.
- `GET /admin/dishes/<int:dish_id>`
  - Description: Get a specific dish by ID.
  - Requires: Admin authentication.
- `PUT /admin/dishes/<int:dish_id>`
  - Description: Update a dish by ID.
  - Requires: Admin authentication.
  - Request Body: JSON with updated dish details.
- `DELETE /admin/dishes/<int:dish_id>`
  - Description: Delete a dish by ID.
  - Requires: Admin authentication.

### Admin - Allergens
- `GET /admin/allergens`
  - Description: Get all allergens.
  - Requires: Admin authentication.
- `POST /admin/allergens`
  - Description: Add a new allergen.
  - Requires: Admin authentication.
  - Request Body: JSON with allergen details.
- `GET /admin/allergens/<int:allergen_id>`
  - Description: Get a specific allergen by ID.
  - Requires: Admin authentication.
- `PUT /admin/allergens/<int:allergen_id>`
  - Description: Update an allergen by ID.
  - Requires: Admin authentication.
  - Request Body: JSON with updated allergen details.
- `DELETE /admin/allergens/<int:allergen_id>`
  - Description: Delete an allergen by ID.
  - Requires: Admin authentication.

### Admin - Menu Items
- `GET /admin/menu_items`
  - Description: Get all menu items.
  - Requires: Admin authentication.
- `POST /admin/menu_items`
  - Description: Add a new menu item.
  - Requires: Admin authentication.
  - Request Body: JSON with menu item details.
- `GET /admin/menu_items/<int:menu_item_id>`
  - Description: Get a specific menu item by ID.
  - Requires: Admin authentication.
- `PUT /admin/menu_items/<int:menu_item_id>`
  - Description: Update a menu item by ID.
  - Requires: Admin authentication.
  - Request Body: JSON with updated menu item details.
- `DELETE /admin/menu_items/<int:menu_item_id>`
  - Description: Delete a menu item by ID.
  - Requires: Admin authentication.

## Running Locally (Without Docker - for development/testing)
(Provide instructions on how to set up a virtual environment, install dependencies, and run the Flask app directly, if applicable.)

## Running with Docker Compose
The API service is included in the main `docker-compose.yml` file and can be built and run with `docker-compose build api` and `docker-compose up -d api`.