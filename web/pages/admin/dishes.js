import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
// Assuming app router navigation
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const ManageDishesPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && isLoggedIn !== undefined) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, router]);

  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);
  const [newDishName, setNewDishName] = useState('');
  const [newDishDescription, setNewDishDescription] = useState('');
  const [addError, setAddError] = useState(null);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editedDishName, setEditedDishName] = useState('');
  const [editedDishDescription, setEditedDishDescription] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const fetchDishes = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
          // Assuming your Flask API uses session cookies for authentication
          // If using token-based auth, you'd add an Authorization header here
          const res = await fetch(`${apiUrl}/admin/dishes`, {
            headers: {
              'Content-Type': 'application/json',
              // Add Authorization header if using tokens:
              // 'Authorization': `Bearer ${yourAuthToken}`
            },
          });
          if (!res.ok) {
            throw new Error(`Error fetching dishes: ${res.status}`);
          }
          const data = await res.json();
          setDishes(data);
        } catch (err) {
          setError(err.message);
          console.error("Failed to fetch dishes:", err);
        }
      };
      fetchDishes();
    }
  }, [isLoggedIn]); // Refetch dishes when login status changes

  const fetchDishes = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${apiUrl}/admin/dishes`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Error fetching dishes: ${res.status}`);
      }
      const data = await res.json();
      setDishes(data);
      setError(null); // Clear previous fetch errors
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch dishes:", err);
    }
  }, []); // Depend on nothing as apiUrl is from env

  const handleDeleteDish = async (dishId) => {
    if (confirm('Are you sure you want to delete this dish?')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await fetch(`${apiUrl}/admin/dishes/${dishId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`Error deleting dish: ${res.status}`);
        }
        fetchDishes(); // Refresh the list
      } catch (err) {
        alert(`Failed to delete dish: ${err.message}`); // Simple alert for delete error
        console.error("Failed to delete dish:", err);
      }
    }
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDishName || !newDishDescription) {
      setAddError('Please fill in both name and description.');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${apiUrl}/admin/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDishName, description: newDishDescription }),
      });
      if (!res.ok) {
        throw new Error(`Error adding dish: ${res.status}`);
      }
      setNewDishName('');
      setNewDishDescription('');
      setAddError(null);
      fetchDishes(); // Refresh the list
    } catch (err) {
      setAddError(err.message);
      console.error("Failed to add dish:", err);
    }
  return (
    <Layout>
      {isLoggedIn ? (
        <div>
          <h1>Manage Dishes Page</h1>
          <p>Content for managing dishes will go here.</p>
          
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          <h2>Dishes List</h2>
          {dishes.length > 0 ? (
            <ul>
              {/* Display existing dishes */}
              {dishes.map(dish => (
                <li key={dish.id}>
                  <strong>{dish.name}</strong>: {dish.description} (Allergen ID: {dish.allergens_id})
                  <button onClick={() => {
                    setEditingDishId(dish.id);
                    setEditedDishName(dish.name);
                    setEditedDishDescription(dish.description);
                  }}>Edit</button>
                  <button onClick={() => handleDeleteDish(dish.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p>No dishes found or still loading...</p>
          )}
          <nav>

          {/* Form for editing a dish */}
          {editingDishId !== null && (
            <div>
              <h2>Edit Dish</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!editedDishName || !editedDishDescription) {
                  alert('Please fill in both name and description.'); // Simple alert for edit validation
                  return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                try {
                  const res = await fetch(`${apiUrl}/admin/dishes/${editingDishId}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: editedDishName, description: editedDishDescription }),
                  });
                  if (!res.ok) {
                    throw new Error(`Error updating dish: ${res.status}`);
                  }
                  setEditingDishId(null); // Exit editing mode
                  setEditedDishName('');
                  setEditedDishDescription('');
                  fetchDishes(); // Refresh the list
                } catch (err) {
                  alert(`Failed to update dish: ${err.message}`); // Simple alert for edit error
                  console.error("Failed to update dish:", err);
                }
              }}>
                <div>
                  <label>Name:</label>
                  <input type="text" value={editedDishName} onChange={(e) => setEditedDishName(e.target.value)} required />
                </div>
                <div>
                  <label>Description:</label>
                  <input type="text" value={editedDishDescription} onChange={(e) => setEditedDishDescription(e.target.value)} required />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingDishId(null)}>Cancel</button>
              </form>
            </div>
          )}

          {/* Form for adding a new dish */}
          <h2>Add New Dish</h2>
          {addError && <p style={{ color: 'red' }}>Error: {addError}</p>}
          <form onSubmit={handleAddDish}>
            <div>
              <label htmlFor="newDishName">Name:</label>
              <input
                type="text"
                id="newDishName"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newDishDescription">Description:</label>
              <input
                type="text"
                id="newDishDescription"
                value={newDishDescription}
                onChange={(e) => setNewDishDescription(e.target.value)}
                required
              />
            <ul>
              <li>
                <Link href="/admin/dashboard">Back to Dashboard</Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </Layout>
  );
};

export default ManageDishesPage;