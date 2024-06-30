// ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(
    systemTheme === "dark" ? DARK_THEME : LIGHT_THEME
  );

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("themeMode");
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme(systemTheme === "dark" ? DARK_THEME : LIGHT_THEME);
      }
    };

    loadTheme();
  }, [systemTheme]);

  useEffect(() => {
    AsyncStorage.setItem("themeMode", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
