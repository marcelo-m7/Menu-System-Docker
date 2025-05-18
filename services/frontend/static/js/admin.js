document.addEventListener('DOMContentLoaded', function () {
  const adminContent = document.getElementById('admin-content');

  const dishesList = document.getElementById('dishes-list');
  const addDishForm = document.getElementById('add-dish-form');
  const allergensList = document.getElementById('allergens-list');
  const addAllergenForm = document.getElementById('add-allergen-form');
  const menuItemsList = document.getElementById('menu-items-list');
  const addMenuItemForm = document.getElementById('add-menu-item-form');
  const dishSelect = document.getElementById('dish-select');

  let editingDishId = null; // To keep track of the dish being edited
  let editingAllergenId = null; // To keep track of the allergen being edited
  let editingMenuItemId = null; // To keep track of the menu item being edited
  let dishesData = []; // Store dishes for populating dropdown
  const messageArea = document.getElementById('admin-message-area'); // Assuming you add an element with id="admin-message-area" in admin.html
  const logoutButton = document.getElementById('logout-button'); // Assuming you add an element with id="logout-button" in admin.html

  // --- Authentication Check and Initial Data Fetch ---
  fetch('http://127.0.0.1:5000/admin/test')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        // Not authenticated, redirect to login page
        window.location.href = '/admin_login.html';
      } else {
        throw new Error('Error accessing admin dashboard');
      }
    })
    .then((data) => {
      adminContent.innerHTML = '<h2>Welcome to the Admin Area!</h2><p>' + data.message + '</p>';
      // Fetch and display data after successful authentication
      fetchDishes();
      fetchAllergens();
      fetchMenuItems();
      populateDishSelect(); // Populate the dropdown for menu items
    })
    .catch((error) => {
      console.error('Error:', error);
      adminContent.innerHTML = '<p>Error loading admin content.</p>';
    });

  // --- Dish Management ---

    function displayMessage(message, type = 'success') {
        messageArea.textContent = message;
        messageArea.style.color = type === 'success' ? 'green' : 'red';
    }

  function fetchDishes() {
    console.log("Fetching dishes...");
    fetch('http://127.0.0.1:5000/admin/dishes')
      .then((response) => response.json())
      .then((dishes) => {
        dishesData = dishes; // Store fetched dishes
        dishesList.innerHTML = ''; // Clear the list

        if (dishes.length === 0) {
          dishesList.innerHTML = '<p>No dishes available.</p>';
          return;
        }

        const ul = document.createElement('ul');
        // Add a title for the dishes list
        const title = document.createElement('h3');
        title.textContent = 'Dishes';
        dishesList.appendChild(title);
        dishes.forEach(dish => {
          const li = document.createElement('li');
          li.textContent = `${dish.name} (Description: ${dish.description || 'N/A'}) (Allergen ID: ${dish.allergens_id || 'N/A'})`;
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.dataset.dishId = dish.id;
          editButton.addEventListener('click', handleEditDish);

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.dataset.dishId = dish.id;
          deleteButton.addEventListener('click', handleDeleteDish);

          li.appendChild(editButton);
          li.appendChild(deleteButton);
          ul.appendChild(li);
        });
        dishesList.appendChild(ul);
        populateDishSelect(); // Refresh dish select dropdown in case dishes changed
            })
      .catch(error => {
        console.error('Error fetching dishes:', error);
        dishesList.innerHTML = '<p>Error loading dishes.</p>';
            });
    }

    function handleEditDish(event) {
      const dishId = parseInt(event.target.dataset.dishId);
      const dish = dishesData.find(d => d.id === dishId);
      if (dish) {
        document.getElementById('dish-name').value = dish.name;
        document.getElementById('dish-description').value = dish.description || '';
        document.getElementById('dish-allergens_id').value = dish.allergens_id || '';
        addDishForm.querySelector('button[type="submit"]').textContent = 'Save Changes';
        editingDishId = dish.id; // Set the ID of the dish being edited
    }

}
  // --- Allergen Management ---
  // --- Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            fetch('http://127.0.0.1:5000/admin/logout')
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/admin_login.html'; // Redirect to login page on successful logout
                    } else {
                        // Handle logout error if necessary
                        console.error('Logout failed');
                        alert('Logout failed.');
                    }
                })
                .catch(error => {
                    console.error('Error during logout:', error);
                });
        });
    }

  function fetchAllergens() {
    console.log("Fetching allergens...");
    fetch('http://127.0.0.1:5000/admin/allergens')
      .then((response) => response.json())
      .then((allergens) => {
        allergensList.innerHTML = ''; // Clear the list

        if (allergens.length === 0) {
          allergensList.innerHTML = '<p>No allergens available.</p>';
          return;
        }

        const ul = document.createElement('ul');
        // Add a title for the allergens list
        const title = document.createElement('h3');
        title.textContent = 'Allergens';
        allergensList.appendChild(title);
        allergens.forEach(allergen => {
          const li = document.createElement('li');
          li.textContent = allergen.name;
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.dataset.allergenId = allergen.id;
          editButton.addEventListener('click', handleEditAllergen);
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.dataset.allergenId = allergen.id;
          deleteButton.addEventListener('click', handleDeleteAllergen);
          li.appendChild(editButton);
          li.appendChild(deleteButton);
          ul.appendChild(li);
        });
        allergensList.appendChild(ul);
      })
      .catch((error) => {
        console.error('Error fetching allergens:', error);

        allergensList.innerHTML = '<p>Error loading allergens.</p>';
      });
  }

  function handleEditAllergen(event) {
    const allergenId = event.target.dataset.allergenId;
    fetch(`http://127.0.0.1:5000/admin/allergens/${allergenId}`)
      .then((response) => response.json())
      .then((allergen) => {
        document.getElementById('allergen-name').value = allergen.name;
        document.getElementById('add-allergen-form').querySelector('button[type="submit"]').textContent = 'Save Changes';
        editingAllergenId = allergen.id; // Set the ID of the allergen being edited
      })
      .catch((error) => {
        console.error('Error fetching allergen for edit:', error);
        displayMessage('Error loading allergen details.', 'error');
      });
  }

    function handleDeleteDish(event) {
        const dishId = event.target.dataset.dishId;
        if (confirm('Are you sure you want to delete this dish?')) {
            fetch(`http://127.0.0.1:5000/admin/dishes/${dishId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        fetchDishes(); // Refresh the list
                    } else {
                        response.json().then(data => {
                            alert('Error deleting dish: ' + (data.message || 'Unknown error'));
                            displayMessage('Error deleting dish: ' + (data.message || 'Unknown error'), 'error');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error deleting dish:', error);
                });
        }
    }

    function handleDeleteAllergen(event) {
    const allergenId = event.target.dataset.allergenId;
    if (confirm('Are you sure you want to delete this allergen?')) {
      fetch(`http://127.0.0.1:5000/admin/allergens/${allergenId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            fetchAllergens(); // Refresh the list
          } else {
            response.json().then((data) => {
              alert('Error deleting allergen: ' + (data.message || 'Unknown error'));
              displayMessage('Error deleting allergen: ' + (data.message || 'Unknown error'), 'error');
            });
          }
        })
        .catch((error) => {
          console.error('Error deleting allergen:', error);
        });
    }
  }


  addAllergenForm.addEventListener('submit', function (event) {
    event.preventDefault();

        const formData = new FormData(addAllergenForm);
        const url = editingAllergenId !== null ?
            `http://127.0.0.1:5000/admin/allergens/${editingAllergenId}` : 'http://127.0.0.1:5000/admin/allergens';
        const method = editingAllergenId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'}, // Specify content type
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to save allergen');
                    });
                }
            })
            .then(data => {
                addAllergenForm.reset(); // Clear the form
                addAllergenForm.querySelector('button[type="submit"]').textContent = 'Add Allergen';
                editingAllergenId = null; // Reset editing state
                displayMessage('Allergen saved successfully!', 'success');
                fetchAllergens(); // Refresh the list
            })
            .catch(error => {
                console.error('Error saving allergen:', error);
                displayMessage('Error saving allergen: ' + error.message, 'error');
                alert('Error saving allergen: ' + error.message);
    });

    addDishForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(addDishForm);
        const url = editingDishId !== null ?
            `http://127.0.0.1:5000/admin/dishes/${editingDishId}` :
            'http://127.0.0.1:5000/admin/dishes';
        const method = editingDishId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'}, // Specify content type


        // --- Menu Item Management ---
    function fetchMenuItems() {
        console.log("Fetching menu items...");
        fetch('http://127.0.0.1:5000/admin/menu_items')
            .then(response => response.json())
            .then(menuItems => {
                menuItemsList.innerHTML = ''; // Clear the list

                if (menuItems.length === 0) {
                    menuItemsList.innerHTML = '<p>No menu items available.</p>';
                    return;
                }
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to save dish');
                    });
                }
            })
            .then((data) => {
                addDishForm.reset(); // Clear the form
                document.getElementById('add-dish-form').querySelector('button[type="submit"]').textContent = 'Add Dish';
                editingDishId = null; // Reset editing state
                fetchDishes(); // Refresh the dish list
                populateDishSelect(); // Refresh dish select dropdown if dishes changed
                displayMessage('Dish saved successfully!', 'success');
            })
    })

        const ul = document.createElement('ul');
        // Add a title for the menu items list
        const title = document.createElement('h3');
        title.textContent = 'Weekly Menu Items';
        menuItemsList.appendChild(title);
        menuItems.forEach(item => { // Removed a duplicate closing curly brace here
          const li = document.createElement('li');
          li.textContent = `${item.day_of_week}, ${item.week_start_date} to ${item.week_end_date}: ${item.dish_name} (Allergens: ${item.allergen_name || 'None'})`;

          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.dataset.menuItemId = item.id;
          editButton.dataset.menuItem = JSON.stringify(item); // Store item data
          editButton.addEventListener('click', handleEditMenuItem);

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.dataset.menuItemId = item.id;
          deleteButton.addEventListener('click', handleDeleteMenuItem);

          li.appendChild(editButton);
          li.appendChild(deleteButton);
          ul.appendChild(li);
        });
        menuItemsList.appendChild(ul);
            })
            .catch(error => {
              console.error('Error fetching menu items:', error);
              menuItemsList.innerHTML = '<p>Error loading menu items.</p>';
            });
          }
    function populateDishSelect() {
      // Assuming dishesData is already fetched by fetchDishes()
      dishSelect.innerHTML = '<option value="">Select a Dish</option>'; // Clear existing options
      dishesData.forEach(dish => {
        const option = document.createElement('option');
        option.value = dish.id;
        option.textContent = dish.name;
        dishSelect.appendChild(option);
      });
    }

    function handleEditMenuItem(event) {
      const menuItem = JSON.parse(event.target.dataset.menuItem);
      document.getElementById('menu-item-week_start_date').value = menuItem.week_start_date;
      document.getElementById('menu-item-week_end_date').value = menuItem.week_end_date;
      document.getElementById('menu-item-day_of_week').value = menuItem.day_of_week;
      document.getElementById('dish-select').value = menuItem.dish_id; // Set selected dish
      addMenuItemForm.querySelector('button[type="submit"]').textContent = 'Save Changes';
      editingMenuItemId = menuItem.id; // Set the ID of the menu item being edited
    }

    function handleDeleteMenuItem(event) {
      const menuItemId = event.target.dataset.menuItemId;
      fetch(`http://127.0.0.1:5000/admin/menu_items/${menuItemId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            fetchMenuItems(); // Refresh the list
          } else {
            response.json().then((data) => {
              alert('Error deleting menu item: ' + (data.message || 'Unknown error'));
              displayMessage('Error deleting menu item: ' + (data.message || 'Unknown error'), 'error');
            });
          }
        })
        .catch((error) => {
          console.error('Error deleting menu item:', error);
        });
    }

  addMenuItemForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(addMenuItemForm);
    const url = editingMenuItemId !== null ?
      `http://127.0.0.1:5000/admin/menu_items/${editingMenuItemId}` :
      'http://127.0.0.1:5000/admin/menu_items';
    const method = editingMenuItemId ? 'PUT' : 'POST';

    // Get the selected dish_id
    const selectedDishId = dishSelect.value;
    if (!selectedDishId) {
      alert('Please select a dish.');
        displayMessage('Please select a dish.', 'error');
    }
    formData.set('dish_id', selectedDishId); // Add or update dish_id in form data

    fetch(url, {
      method: method,
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
             return response.json().then(data => {
                 throw new Error(data.message || 'Failed to save menu item');
             });
        }
      })
      .then((data) => {
        addMenuItemForm.reset(); // Clear the form
        addMenuItemForm.querySelector('button[type="submit"]').textContent = 'Add Menu Item';
        editingMenuItemId = null; // Reset editing state
        displayMessage('Menu item saved successfully!', 'success');
        fetchMenuItems(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error saving menu item:', error);
        displayMessage('Error saving menu item: ' + error.message, 'error');
      });
  });

});