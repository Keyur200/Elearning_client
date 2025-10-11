import React, { useState, useEffect } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center justify-center mx-2 cursor-pointer">
      {theme === "light" ? (
        <BiMoon
          size={25}
          onClick={() => setTheme("dark")}
          className="text-gray-800 dark:text-white"
        />
      ) : (
        <BiSun
          size={25}
          onClick={() => setTheme("light")}
          className="text-gray-800 dark:text-white"
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
