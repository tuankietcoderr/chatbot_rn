import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from "react";
import { useColorScheme, ColorSchemeName } from "react-native";
import React from "react";

interface IThemeContext {
  theme: ColorSchemeName;
  setTheme: (theme: ColorSchemeName) => void;
  toggleTheme: (theme: ColorSchemeName) => void;
}

export const ThemeContext = createContext<IThemeContext>({
  theme: "light",
  setTheme: (theme: ColorSchemeName) => {},
  toggleTheme: (theme: ColorSchemeName) => {},
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(
    colorScheme || ("light" as ColorSchemeName)
  );
  useEffect(() => {
    // Load saved theme from storage
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(
          "theme"
        )) as ColorSchemeName;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      }
    };
    getTheme();
  }, []);

  useEffect(() => {
    // set theme to system selected theme
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  const toggleTheme = (newTheme: ColorSchemeName) => {
    setTheme(newTheme);
    // Save selected theme to storage
    AsyncStorage.setItem("theme", newTheme as string);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
