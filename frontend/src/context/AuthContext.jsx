// AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("crm_token"));
  const [user, setUser] = useState(localStorage.getItem("user"));

  const login = (token, user) => {
    localStorage.setItem("crm_token", token);
    localStorage.setItem("user", user);
    setToken(token);
    setUser(user);
    console.log(token, user);
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          const user = response.data;
          setUser(user);
        });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
