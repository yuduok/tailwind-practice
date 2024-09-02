'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useTheme } from "../themeContext";

const predefinedFonts = [
  { name: 'Serif', value: 'serif' },
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Fantasy', value: 'fantasy' },
  { name: 'Custom', value: 'custom' },
];

export default function SignaturePage() {
  const [name, setName] = useState('');
  const [selectedFont, setSelectedFont] = useState(predefinedFonts[0]);
  const [customFont, setCustomFont] = useState('');
  const signatureRef = useRef(null);
  const { state } = useTheme();

  const handleFontChange = (e) => {
    const selectedValue = e.target.value;
    const font = predefinedFonts.find(f => f.value === selectedValue);
    setSelectedFont(font);
    if (selectedValue !== 'custom') {
      setCustomFont('');
    }
  };

  const currentFontFamily = selectedFont.value === 'custom' ? customFont : selectedFont.value;

  const saveAsImage = (format) => {
    if (signatureRef.current) {
      html2canvas(signatureRef.current).then(canvas => {
        const image = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = image;
        link.download = `signature.${format}`;
        link.click();
      });
    }
  };

  return (
    <div className={state.darkMode ? "dark" : ""}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <h1 className="text-black dark:text-white text-2xl font-bold mb-6">Signature Generator</h1>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter your name
              </label>
              <input
                type="text"
                id="name"
                className="text-black dark:text-white mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="font" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select a font
              </label>
              <select
                id="font"
                className="text-black dark:text-white mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700"
                value={selectedFont.value}
                onChange={handleFontChange}
              >
                {predefinedFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedFont.value === 'custom' && (
              <div className="mb-4">
                <label htmlFor="customFont" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter custom font family,ensure it is installed on the your device
                </label>
                <input
                  type="text"
                  id="customFont"
                  className="text-black dark:text-white mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700"
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  placeholder="E.g., 'Arial', sans-serif"
                />
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-black dark:text-white text-lg font-semibold mb-2">Your Signature:</h2>
              <div 
                ref={signatureRef}
                className="text-black dark:text-white text-4xl p-4 border border-gray-300 dark:border-gray-700 rounded-md min-h-[100px] flex items-center justify-center bg-white dark:bg-gray-700"
                style={{ fontFamily: currentFontFamily }}
              >
                {name || 'Your signature will appear here'}
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => saveAsImage('png')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save as PNG
              </button>
              <button
                onClick={() => saveAsImage('jpeg')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save as JPEG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}