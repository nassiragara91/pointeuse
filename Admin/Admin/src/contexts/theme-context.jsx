
"use client"
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const initialState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
  const [theme, setTheme] = useState("system");

  // Set initial theme from localStorage once component mounts (client-side only)
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Apply theme to <html> tag
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
};
