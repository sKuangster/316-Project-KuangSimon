"use client";

import { useState } from "react";

export default function Avatar({ onSelect }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Convert uploaded file to Base64 string
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // MAIN HANDLER
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    if (!file.type.includes("png") && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
      setError("Please select a PNG or JPG image.");
      return;
    }

    const base64 = await fileToBase64(file);

    // Validate dimensions BEFORE updating preview
    validateDimensions(base64, (isValid) => {
      if (!isValid) {
        setError("Image must be exactly 200×200 pixels.");
        return;
      }

      // Only runs if valid
      setPreview(base64);
      onSelect(base64);
    });
  };

  // Validate EXACT dimensions using an Image() object
  const validateDimensions = (base64, callback) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const isValid = img.width === 200 && img.height === 200;
      callback(isValid);
    };

    img.onerror = () => callback(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[120px] mb-3">
        {preview ? (
          <img src={preview} className="w-full h-full rounded-full object-cover border" />
        ) : (
          <img src="/placeholder_avatar.png" className="w-full h-full rounded-full object-cover border" />
        )}
      </div>

      <label className="bg-black text-white px-4 py-2 rounded cursor-pointer">
        Select
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {error && <p className="text-red-600 text-sm mt-2 w-[150px] text-center">{error}</p>}
    </div>
  );
}
