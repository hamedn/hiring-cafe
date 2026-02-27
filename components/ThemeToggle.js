import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return { theme, toggleTheme };
}

export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="flex items-center space-x-3 w-fit">
      <span className="text-sm font-medium text-gray-700">
        {theme === "light" ? "Light" : "Dark"}
      </span>
      <div
        onClick={toggleTheme}
        className="flex items-center space-x-2 p-0.5 rounded-full bg-gray-200 shadow-inner border border-gray-300"
        aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      >
        <div
          className={`rounded-full p-1 ${
            theme === "light" ? "bg-orange-400 text-white" : ""
          }`}
        >
          <SunIcon className="h-3 w-3" />
        </div>
        <div
          className={`rounded-full p-1 ${
            theme === "dark" ? "bg-gray-400" : ""
          }`}
        >
          <MoonIcon className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
}
