'use client';

import React, { useContext, useState, useEffect } from "react";
import { auth } from '../../firebase';
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

// Create an AuthContext using React Context API
// This will allow the entire application to access the authenticated user
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  // State management to track the authenticated user and authentication status
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true); // Loading is set to true 
  const [token, setToken] = useState(null);

  // We use a useEffect() hook to track any changes in the authentication state
  // Using firebases onAuthStateChanged() function
  useEffect(() => {
    // Async, wait for the authentication state to change
    // onAuthStateChanged starts to listen for changes in authentication state
    // and calls a callback function when the state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('onAuthStateChanged user:', user); // Debugging to check if the user is authenticated
      if (user) {
        // Update the state with the authenticated user
        setCurrentUser(user);
        setUserLoggedIn(true);

        // Checking if the user is signed in with email
        const isEmail = user.providerData.some(
          (provider) => provider.providerId === "password"
        );
        // Update the use state to the users email
        setIsEmailUser(isEmail);

        // Checking if the user is signing in with google
        const isGoogle = user.providerData.some(
          (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
        );
        // Update the user state to the users google email
        setIsGoogleUser(isGoogle);

        // Getting the users authentication token 
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      // Loading is complete, set the loading state to false
      // User is logged in
      setLoading(false);
    });
    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
    // Array is empty, that way it only runs once after the first render
  }, []);

  // Function to get the token
  const getToken = async () => {
    return token;
  };

  // These are the variables that can be used globally from the AuthContext import
  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
    getToken,
  };

  // Render the provider with the authentication state
  // This is done by ensuring that other files are only rendered once loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider