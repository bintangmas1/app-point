

import { useState, useEffect, useCallback } from "react";

export const useDarkMode = () => {
  const [theme, setTheme] = useState<string>("dark"); // Set default to "light"
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"; // Default to "light"
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    if (typeof window !== "undefined") {
      const dmContainer = document.querySelector(
        ".dark-mode-switching"
      ) as HTMLElement;
      if (dmContainer) {
        dmContainer.style.display = "block";
        dmContainer.style.opacity = "1";

        setTimeout(() => {
          const fadeOut = setInterval(() => {
            if (parseFloat(dmContainer.style.opacity) > 0) {
              dmContainer.style.opacity = (
                parseFloat(dmContainer.style.opacity) - 0.1
              ).toString();
            } else {
              clearInterval(fadeOut);
              dmContainer.style.display = "none";
            }
          }, 20);
        }, 1000);
      }
    }
    toggleTheme();
  }, [toggleTheme]);

  return { theme, toggleTheme, handleDarkModeToggle };
};
