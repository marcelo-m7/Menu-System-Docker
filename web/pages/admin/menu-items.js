import React, { useEffect, useState } from 'react';
import Link from 'next/link';
// Import useRouter from 'next/navigation' if using app router
import { useRouter } from 'next/router'; 
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const ManageMenuItemsPage = () => {
  const { isLoggedIn, getToken } = useAuth(); // Assuming getToken is available from context
  const router = useRouter();

  const [menuItems, setMenuItems] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    dishId: '',
    dayOfWeek: '',
    weekStartDate: '',
    weekEndDate: '',
  });
  const [editingMenuItemId, setEditingMenuItemId] = useState(null);
  const [editedMenuItem, setEditedMenuItem] = useState({});

  // Route protection
  useEffect(() => {
    if (!isLoggedIn && isLoggedIn !== undefined) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, router]);

  // Fetch menu items
  const fetchMenuItems = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = getToken(); // Get token from context
    if (!apiUrl || !token) return; // Don't fetch if API URL or token is missing

    try {
      const res = await fetch(`${apiUrl}/admin/menu_items`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token authentication
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      } else {
        console.error('Failed to fetch menu items:', res.status, await res.text());
        // Handle unauthorized or other errors, e.g., logout and redirect
        if (res.status === 401 || res.status === 403) {
             // Handle unauthorized access, maybe log out the user
             // logout(); // Assuming logout is in useAuth context
             // router.push('/admin/login');
           }
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) { // Fetch only if logged in
        fetchMenuItems();
    }
  }, [isLoggedIn]); // Refetch when login status changes

  // Fetch dishes for dropdown
  const fetchDishes = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = getToken(); // Get token from context
    if (!apiUrl || !token) return; // Don't fetch if API URL or token is missing

    try {
      const res = await fetch(`${apiUrl}/admin/dishes`, {
         headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token authentication
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDishes(data);
      } else {
        console.error('Failed to fetch dishes:', res.status, await res.text());
         if (res.status === 401 || res.status === 403) {
             // Handle unauthorized access
           }
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

   useEffect(() => {
    if (isLoggedIn) { // Fetch only if logged in
        fetchDishes();
    }
  }, [isLoggedIn]); // Refetch when login status changes

  // Handle new menu item form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

   // Handle editing menu item form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMenuItem(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

   // Start editing a menu item
  const handleStartEditing = (item) => {
    setEditingMenuItemId(item.id);
    setEditedMenuItem({ ...item, dishId: item.dish_id }); // Initialize edited item with existing data
  };
  // Handle adding a new menu item
  const handleAddMenuItem = async (event) => {
    event.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
     const token = getToken(); // Get token from context
    if (!apiUrl || !token) return;

    try {
      const res = await fetch(`${apiUrl}/admin/menu_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`, // Use Bearer token authentication
        },
        body: JSON.stringify({
          dish_id: parseInt(newMenuItem.dishId), // Ensure dish_id is an integer
          day_of_week: newMenuItem.dayOfWeek,
          week_start_date: newMenuItem.weekStartDate,
          week_end_date: newMenuItem.weekEndDate,
        }),
      });

      if (res.ok) {
        // Successfully added, refetch menu items and reset form
        fetchMenuItems();
        setNewMenuItem({
          dishId: '',
          dayOfWeek: '',
          weekStartDate: '',
          weekEndDate: '',
        });
        alert('Menu item added successfully!');
      } else {
        const errorData = await res.json();
        console.error('Failed to add menu item:', res.status, errorData);
        alert(`Failed to add menu item: ${errorData.message || res.statusText}`);
         if (res.status === 401 || res.status === 403) {
             // Handle unauthorized access
           }
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('An error occurred while adding the menu item.');
    }
  };

  // Handle saving edited menu item
  const handleSaveMenuItemEdit = async (event) => {
    event.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = getToken();
    if (!apiUrl || !token || !editingMenuItemId) return;

    try {
      const res = await fetch(`${apiUrl}/admin/menu_items/${editingMenuItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          dish_id: parseInt(editedMenuItem.dishId),
          day_of_week: editedMenuItem.day_of_week,
          week_start_date: editedMenuItem.week_start_date,
          week_end_date: editedMenuItem.week_end_date,
        }),
      });

      if (res.ok) {
        fetchMenuItems();
        setEditingMenuItemId(null);
        setEditedMenuItem({});
        alert('Menu item updated successfully!');
      } else {
        const errorData = await res.json();
        console.error('Failed to update menu item:', res.status, errorData);
        alert(`Failed to update menu item: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('An error occurred while updating the menu item.');
    }
  };

  // Cancel editing
  const handleCancelMenuItemEdit = () => {
    setEditingMenuItemId(null);
    setEditedMenuItem({});
  };
  return (
 <Layout>
 {isLoggedIn ? (
 <div>
 <h1>Manage Weekly Menu Items</h1>

 {/* Display list of menu items */}
 <h2>Current Weekly Menu Items</h2>
 {menuItems.length > 0 ? (
 <ul>
            {menuItems.map(item => (
 <li key={item.id}>
 {editingMenuItemId === item.id ? (
 {/* Editing Form */}
                  <form onSubmit={handleSaveMenuItemEdit}>
 <div>
 <label htmlFor={`edit-dishId-${item.id}`}>Dish:</label>
 <select
 id={`edit-dishId-${item.id}`}
 name="dishId"
 value={editedMenuItem.dishId}
 onChange={handleEditInputChange}
 required
 >
 <option value="">Select a dish</option>
                        {dishes.map(dish => (
 <option key={dish.id} value={dish.id}>{dish.name}</option>
 ))}
 </select>
 </div>
 <div>
 <label htmlFor={`edit-dayOfWeek-${item.id}`}>Day of the Week:</label>
 <select
 id={`edit-dayOfWeek-${item.id}`}
 name="day_of_week"
 value={editedMenuItem.day_of_week}
 onChange={handleEditInputChange}
 required
 >
 <option value="">Select a day</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
 <option key={day} value={day}>{day}</option>
 ))}
 </select>
 </div>
 <div>
 <label htmlFor={`edit-weekStartDate-${item.id}`}>Week Start Date:</label>
 <input type="date" id={`edit-weekStartDate-${item.id}`} name="week_start_date" value={editedMenuItem.week_start_date} onChange={handleEditInputChange} required />
 </div>
 <div>
 <label htmlFor={`edit-weekEndDate-${item.id}`}>Week End Date:</label>
 <input type="date" id={`edit-weekEndDate-${item.id}`} name="week_end_date" value={editedMenuItem.week_end_date} onChange={handleEditInputChange} required />
 </div>
 <button type="submit">Save</button>
 <button type="button" onClick={handleCancelMenuItemEdit}>Cancel</button>
                  </form>
 ) : (
 {/* Display mode */}
 <span>Week: {item.week_start_date} - {item.week_end_date}, Day: {item.day_of_week}, Dish: {item.dish_name}</span>
 )}
 {/* Edit and Delete buttons */}
 {!editingMenuItemId && ( // Only show buttons when not editing this item
 <span style={{ marginLeft: '10px' }}>
 <button onClick={() => handleStartEditing(item)}>Edit</button>
 {/* Add delete button later */}
 </span>
 )}
 </li>
 ))}
 </ul>
 ) : (
 <p>No weekly menu items found.</p>
 )}

 {/* Form to Add New Menu Item */}
        <h2>Add New Menu Item</h2>
        <form onSubmit={handleAddMenuItem}>
          <div>
            <label htmlFor="dishId">Dish:</label>
            <select
              id="dishId"
              name="dishId"
              value={newMenuItem.dishId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a dish</option>
              {dishes.map(dish => (
                <option key={dish.id} value={dish.id}>{dish.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dayOfWeek">Day of the Week:</label>
            <select
              id="dayOfWeek"
              name="dayOfWeek"
              value={newMenuItem.dayOfWeek}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="weekStartDate">Week Start Date:</label>
            <input type="date" id="weekStartDate" name="weekStartDate" value={newMenuItem.weekStartDate} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="weekEndDate">Week End Date:</label>
            <input type="date" id="weekEndDate" name="weekEndDate" value={newMenuItem.weekEndDate} onChange={handleInputChange} required />
          </div>
          <button type="submit">Add Menu Item</button>
        </form>

 {/* Navigation */}
          <nav>
            <ul>
              <li><Link href="/admin/dashboard">Back to Dashboard</Link></li>
              {/* Add other navigation links here if needed */}
            </ul>
          </nav>
        </div>
 ) : null}
    </Layout>
  );
};

export default ManageMenuItemsPage;