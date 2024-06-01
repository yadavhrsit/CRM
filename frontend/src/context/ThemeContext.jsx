import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("themeMode") || LIGHT_THEME
  );

  useEffect(() => {
    document.documentElement.classList.remove(
      theme === DARK_THEME ? "light" : "dark"
    );
    document.documentElement.classList.add(
      theme === DARK_THEME ? "dark" : "light"
    );
    window.localStorage.setItem("themeMode", theme);
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
