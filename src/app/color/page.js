"use client"
import { useState } from 'react';

// PaletteGenerator component
const PaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#000000'); // State for the base color
  const [palette, setPalette] = useState([]); // State for the generated palette

  // Function to generate a palette based on the base color
  const generatePalette = () => {
    const hsl = hexToHSL(baseColor); // Convert base color from HEX to HSL
    const newPalette = [];

    // Generate 5 colors with varying lightness
    for (let i = 0; i < 5; i++) {
      const lightness = 20 + (i * 15); // Vary from 20% to 80%
      newPalette.push(hslToHex(hsl.h, hsl.s, lightness)); // Convert HSL back to HEX and add to the palette
    }

    setPalette(newPalette); // Update the state with the new palette
  };

  // Function to convert HEX color to HSL color
  const hexToHSL = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // Achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 }; // Return HSL value
  };

  // Function to convert HSL color to HEX color
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0'); // Convert to HEX format
    };
    return `#${f(0)}${f(8)}${f(4)}`; // Return HEX color
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Palette Generator</h2>
      <div className="mb-4">
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)} // Update base color on change
          className="mr-2"
        />
        <button
          onClick={generatePalette} // Trigger palette generation
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Generate Palette
        </button>
      </div>
      <div className="flex space-x-2">
        {palette.map((color, index) => (
          <div key={index} className="text-center">
            <div
              className="w-20 h-20 rounded"
              style={{ backgroundColor: color }} // Apply generated color
            ></div>
            <p className="mt-1 font-mono text-sm">{color}</p> {/* Display HEX color value */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteGenerator;
