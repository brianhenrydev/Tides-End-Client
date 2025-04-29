"use client"
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import apiRequest from '@/lib/axios';

// Creates our context object.
const AppContext = createContext({});

export function AppWrapper({ children }) {
  const [profile, setProfile] = useState({});
  const [token, setToken] = useState("");
  const pathname = usePathname()

  // Useful for when a window is closed and a user opens a new session, still logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await apiRequest.get('auth/profile', {
          headers: {
            Authorization: `Token ${token}` // Note the space after "Token"
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    };

    const authRoutes = ['/login', '/register'];
    
    // If token exists, then check the current route.
    if (token) {
      if (authRoutes.includes(pathname)) {
        setProfile({});
      } else {
        // Fetch the profile for protected routes.
        getProfile().then((profileData) => {
          if (profileData) {
            setProfile(profileData);
          }
        });
      }
    } else {
      setProfile({});
    }
  }, [token, pathname]);

  return (
    // The value prop stores functions and variables in context object. 
    <AppContext.Provider value={{ profile, token, setToken, setProfile }}>
      {children}
    </AppContext.Provider>
  );
}

// Encapsulates React hook, useContext, and context object in a custom hook
export function useAppContext() {
  return useContext(AppContext)
}

