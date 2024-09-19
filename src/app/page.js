"use client";

import Link from 'next/link';
import { useTheme } from "./themeContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/color", label: "Color Palette" },
  { href: "/signature", label: "Signature" },
  { href: "/encrypt", label: "Encrypt" },
];

export default function Home() {
  const { state, dispatch } = useTheme();

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <div className={state.darkMode ? "dark" : ""}>
      <div className="flex flex-col min-h-screen py-2 bg-white dark:bg-gray-900 text-black dark:text-white">
        <nav className="bg-gray-200 dark:bg-gray-800 p-4">
          <ul className="flex justify-center space-x-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold">Hello, World!</h1>
          <button
            onClick={toggleDarkMode}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:bg-yellow-400 dark:hover:bg-yellow-500"
          >
            Toggle Theme
          </button>
        </main>
      </div>
    </div>
  );
}
