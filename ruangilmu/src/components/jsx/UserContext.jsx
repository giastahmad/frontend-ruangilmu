import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // Initial user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data (you would modify this to fit your API)
  const fetchUserData = async () => {
    try {
      // This is a placeholder. Replace with your actual API call
      // const response = await fetch('/api/user/profile');
      // const userData = await response.json();
      
      // For development, we'll use mock data
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        bio: 'Software developer with a passion for React',
        location: 'Jakarta, Indonesia',
        phone: '+62123456789',
        profilePic: 'img/profile-pic.jpg',
        socialMedia: {
          facebook: 'https://facebook.com/johndoe',
          instagram: 'https://instagram.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe'
        }
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update user data
  const updateUser = async (userData) => {
    try {
      // This is where you would make an API call to update the user data
      // For example:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   body: userData
      // });
      // const updatedUser = await response.json();
      
      // For now, we'll just update the state with the provided data
      // In a real app, you should use the response from your API
      setUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
      
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  // Load user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // The value that will be provided to consumers of this context
  const contextValue = {
    user,
    loading,
    updateUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};