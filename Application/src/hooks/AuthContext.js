import { useNavigation } from "@react-navigation/native";
import React, { createContext, useContext, useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from "@api";
import { Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); // Initialize user state

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          // console.log(JSON.parse(userData))
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error reading user data from AsyncStorage:', error);
      }
    };

    checkUser();
  }, []);

  const login = async (email,password) => {
    // Perform login logic and set user data
    try {
      const response = await url.post(`/auth/login`, {
        email: email,
        password: password,
      });
      const data = response.data[0];
      if (!data.error) {
        setUser(data);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
      }
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized: Invalid email or password
        Alert.alert('Login Error', 'Invalid email or password. Please check your credentials.');
      } else {
        // Other errors
        Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
      }
      return { error: 'Login error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await url.post('/auth/register', userData);

      const data = response.data;

      if (!data.error) {
        await login(userData.email,userData.password);
        // await AsyncStorage.setItem('userData', JSON.stringify(data));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Registration error' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // You can also provide other functions and user-related data in the context

  return (
    <AuthContext.Provider value={{ user, login, register, logout,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
