"use client";

import { useState } from "react";

export default function Avatar({ onSelect }) {
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // Check file type
    if (!file.type.includes("png") && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
      setError("Please select a PNG or JPG image.");
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      
      // Validate dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width !== 200 || img.height !== 200) {
          setError(`Image must be exactly 200x200 pixels (yours is ${img.width}x${img.height})`);
          return;
        }
        
        // Valid - pass to parent
        onSelect(base64);
      };
      
      img.onerror = () => {
        setError("Failed to load image");
      };
      
      img.src = base64;
    };
    
    reader.onerror = () => {
      setError("Failed to read file");
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded cursor-pointer transition">
        Upload Avatar (200x200)
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {error && (
        <p className="text-red-600 text-sm mt-2 text-center max-w-[250px]">
          {error}
        </p>
      )}
    </div>
  );
}