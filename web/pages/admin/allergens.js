import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const ManageAllergensPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [allergens, setAllergens] = useState([]);
  const [error, setError] = useState(null);

  const [editingAllergenId, setEditingAllergenId] = useState(null);
  const [editedAllergenName, setEditedAllergenName] = useState('');

  const [newAllergenName, setNewAllergenName] = useState('');
  const fetchAllergens = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/admin/allergens`, {
        headers: {
          // Include authentication headers here (e.g., Authorization: 'Bearer your_token')
          // For now, relying on cookies/sessions if your API handles it that way.
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching allergens: ${response.statusText}`);
      }

      const data = await response.json();
      setAllergens(data);
    } catch (err) {
      console.error("Error fetching allergens:", err);
      setError("Failed to load allergens. Please try again.");
    }
  };

  const handleAddAllergen = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!newAllergenName.trim()) {
      setError("Allergen name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/allergens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers here
        },
        body: JSON.stringify({ name: newAllergenName }),
      });

      if (!response.ok) {
        throw new Error(`Error adding allergen: ${response.statusText}`);
      }

      setNewAllergenName(''); // Clear the form
      fetchAllergens(); // Refresh the list
    } catch (err) {
      console.error("Error adding allergen:", err);
      setError("Failed to add allergen. Please try again.");
    }
  };

  const handleEditAllergen = (allergen) => {
    setEditingAllergenId(allergen.id);
    setEditedAllergenName(allergen.name);
    setError(null); // Clear any previous errors
  };

  const handleCancelAllergenEdit = () => {
    setEditingAllergenId(null);
    setEditedAllergenName('');
    setError(null); // Clear any previous errors
  };

  const handleSaveAllergenEdit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!editedAllergenName.trim()) {
      setError("Allergen name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/allergens/${editingAllergenId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers here
        },
        body: JSON.stringify({ name: editedAllergenName }),
      });

      if (!response.ok) {
        throw new Error(`Error updating allergen: ${response.statusText}`);
      }
      handleCancelAllergenEdit(); // Reset editing state
      fetchAllergens(); // Refresh the list
    } catch (err) {
      console.error("Error updating allergen:", err);
      setError("Failed to update allergen. Please try again.");
    }
  };

  const handleDeleteAllergen = async (allergenId) => {
    if (confirm('Are you sure you want to delete this allergen?')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/admin/allergens/${allergenId}`, {
          method: 'DELETE',
          headers: {
            // Include authentication headers here
          },
        });

        if (!response.ok) {
          throw new Error(`Error deleting allergen: ${response.statusText}`);
        }

        fetchAllergens(); // Refresh the list
      } catch (err) {
        console.error("Error deleting allergen:", err);
        setError("Failed to delete allergen. Please try again.");
      }
    }
  };


  useEffect(() => {
    if (isLoggedIn) {
      fetchAllergens();
    } else if (isLoggedIn !== undefined) { // Redirect only if isLoggedIn is explicitly false
      router.push('/admin/login');
    }
  }, [isLoggedIn, router]); // Depend on isLoggedIn and router

  return (
    <Layout>
      {isLoggedIn ? (
        <div>
          <h1>Manage Allergens Page</h1>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <h2>Existing Allergens</h2>
          {allergens.length > 0 ? (
            <ul>
              {allergens.map((allergen) => (
                <li key={allergen.id}>
                  {editingAllergenId === allergen.id ? (
                    <form onSubmit={handleSaveAllergenEdit} style={{ display: 'inline-block' }}>
                      <input
                        type="text"
                        value={editedAllergenName}
                        onChange={(e) => setEditedAllergenName(e.target.value)}
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleCancelAllergenEdit}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      {allergen.name}
                      <button onClick={() => handleEditAllergen(allergen)} style={{ marginLeft: '10px' }}>Edit</button><button onClick={() => handleDeleteAllergen(allergen.id)} style={{ marginLeft: '10px' }}>Delete</button>
                    </>
                  )}

                </li>
              ))}
            </ul>
          ) : (
            !error && <p>No allergens found.</p>
          )}

          <h2>Add New Allergen</h2>
          <form onSubmit={handleAddAllergen}>
            <div>
              <label htmlFor="newAllergenName">Allergen Name:</label>
              <input
                type="text"
                id="newAllergenName"
                value={newAllergenName}
                onChange={(e) => setNewAllergenName(e.target.value)}
              />
            </div>
            <button type="submit">Add Allergen</button>
          </form>
          <nav>
            <ul>
              <li>
                <Link href="/admin/dashboard">
                  Back to Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </Layout>
  );
};

export default ManageAllergensPage;