const router = new Navigo('/');
const app = document.getElementById('app');

router
  .on('/', function () {
    // Route for the public menu page
    app.innerHTML = '<h1>Public Menu</h1>';
    // In the next step, we will integrate the logic from index.js here.
  })
  .on('/admin/login', function () {
    // Route for the admin login page
    app.innerHTML = '<h1>Admin Login</h1>';
    // In the next step, we will integrate the logic from admin_login.js here.
  })
  .on('/register', function () {
    // Route for the user registration page
    app.innerHTML = '<h1>User Registration</h1>';
    // In the next step, we will integrate the logic from register.js here.
  })
  .on('/admin', function () {
    // Route for the admin dashboard
    app.innerHTML = '<h1>Admin Dashboard</h1>';
    // In the next step, we will integrate the logic from admin.js here.
  })
  .notFound(function () {
    // Handler for unmatched routes
    app.innerHTML = '<h1>Page Not Found</h1>';
  });

// Resolve the current URL to trigger the corresponding route handler
router.resolve();