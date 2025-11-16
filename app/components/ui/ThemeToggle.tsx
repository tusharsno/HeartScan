"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:scale-105 transition-transform shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={22} className="text-yellow-500" />
      ) : (
        <Moon size={22} className="text-gray-700" />
      )}
    </button>
  );
}