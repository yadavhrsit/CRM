// AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("crm_token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (token, user) => {
    localStorage.setItem("crm_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("user");
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
          const decodedToken = response.data;
          setUser(decodedToken.user);
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
