import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase'; // Import Firebase auth instance
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase auth functions

const AuthContext = createContext(null);
// Create AuthProvider component to wrap around components that need auth context
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null); // Use a different name to avoid confusion with local 'user'
  const [idToken, setIdToken] = useState(null); // State to store the Firebase ID token
  const [loading, setLoading] = useState(true); // Add loading state to check auth status initially

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => { // Make the listener function async
      if (firebaseUser) {
        // User is signed in
        setIsLoggedIn(true);
        setUser(firebaseUser); // Store the Firebase user object
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false); // Set loading to false once auth state is determined
    });
    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged listener will handle state update to null
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};