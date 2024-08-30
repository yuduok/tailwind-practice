"use client";

import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  ;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-6xl font-bold">Hello, World!</h1>
        <button
          onClick={toggleDarkMode}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:bg-yellow-400 dark:hover:bg-yellow-500"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
}

