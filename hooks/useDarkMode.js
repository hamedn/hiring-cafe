import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    const changeHandler = (event) => {
      setIsDarkMode(event.matches);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", changeHandler);

    return () => {
      mediaQuery.removeEventListener("change", changeHandler);
    };
  }, []);

  return isDarkMode;
}
