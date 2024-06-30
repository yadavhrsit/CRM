import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../constants/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("crm_token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load token and user from storage", error);
      }
    };

    loadToken();
  }, []);

  const login = async (token, user) => {
    try {
      await AsyncStorage.setItem("crm_token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error("Failed to save token and user to storage", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("crm_token");
      await AsyncStorage.removeItem("user");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Failed to remove token and user from storage", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const user = response.data;
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        logout();
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
