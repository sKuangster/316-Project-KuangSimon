"use client";

import AppBanner from "@/components/AppBanner";
import Copyright from "@/components/Copyright";
import Avatar from "@/components/Avatar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Field-level validation errors
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerifyError, setPasswordVerifyError] = useState("");
  const [avatarError, setAvatarError] = useState("");

  // General error
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate userName
  useEffect(() => {
    if (userName.length === 0) {
      setUserNameError("");
    } else if (userName.trim().length === 0) {
      setUserNameError("User name cannot be empty or whitespace only");
    } else {
      setUserNameError("");
    }
  }, [userName]);

  // Validate email
  useEffect(() => {
    if (email.length === 0) {
      setEmailError("");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  }, [email]);

  // Validate password
  useEffect(() => {
    if (password.length === 0) {
      setPasswordError("");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  }, [password]);

  // Validate password verify
  useEffect(() => {
    if (passwordVerify.length === 0) {
      setPasswordVerifyError("");
    } else if (password !== passwordVerify) {
      setPasswordVerifyError("Passwords do not match");
    } else {
      setPasswordVerifyError("");
    }
  }, [password, passwordVerify]);

  const handleAvatarSelect = (base64Image) => {
    setAvatar(base64Image);
    setAvatarError("");
    setShowAvatarModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = document.createElement('img');
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        // STRICT: Must be exactly 200x200
        if (img.width !== 200 || img.height !== 200) {
          setAvatarError(`Image must be exactly 200x200 pixels (yours is ${img.width}x${img.height})`);
          setAvatar("");
          return;
        }

        // Convert to base64
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        handleAvatarSelect(base64);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  async function handleRegister(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password, passwordVerify, avatar })
      });

      const data = await res.json();

      if (res.status === 200) {
        // SUCCESS - redirect to login (NOT auto-login per spec)
        router.push("/login");
      } else {
        // Show error
        setGeneralError(data.errorMessage || "Registration failed");
      }
    } catch (error) {
      setGeneralError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Button is enabled ONLY when all validations pass
  const isFormValid = 
    userName.trim().length > 0 &&
    email.length > 0 &&
    password.length >= 8 &&
    passwordVerify.length > 0 &&
    avatar.length > 0 &&
    !userNameError &&
    !emailError &&
    !passwordError &&
    !passwordVerifyError &&
    !avatarError;

  return (
    <div className="flex flex-col min-h-screen">
      <AppBanner />

      <div className="flex flex-col flex-grow items-center justify-center bg-orange-100">
        <div className="relative m-3 w-[120px] h-[120px]">
          <Image
            src="/lock.png"
            alt="lock"
            fill
            className="object-contain"
          />
        </div>

        <div className="text-4xl text-gray-600 mb-4">
          Create Account
        </div>

        <form onSubmit={handleRegister} className="flex flex-col items-center w-full">
          <div className="mb-4 flex flex-col items-center">
            <div 
              onClick={() => setShowAvatarModal(true)}
              className={`cursor-pointer w-[100px] h-[100px] rounded-full border-4 overflow-hidden bg-white flex items-center justify-center hover:border-purple-500 transition ${
                avatarError ? 'border-red-500' : 'border-purple-300'
              }`}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="mt-2 text-purple-600 text-sm underline"
            >
              Select Avatar (200x200px required)
            </button>
            {avatarError && (
              <div className="text-red-600 text-xs mt-1 text-center max-w-[300px]">
                {avatarError}
              </div>
            )}
          </div>

          <div className="relative w-[500px] m-3">
            <input
              className={`p-3 rounded border w-full h-[50px] ${
                userNameError ? 'bg-red-100 border-red-500' : 'bg-purple-200 border-gray-300'
              }`}
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {userNameError && (
              <div className="text-red-600 text-xs mt-1 absolute">
                {userNameError}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="relative w-[500px] m-3">
            <input
              className={`p-3 rounded border w-full h-[50px] ${
                emailError ? 'bg-red-100 border-red-500' : 'bg-purple-200 border-gray-300'
              }`}
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <div className="text-red-600 text-xs mt-1 absolute">
                {emailError}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="relative w-[500px] m-3">
            <input
              className={`p-3 rounded border w-full h-[50px] ${
                passwordError ? 'bg-red-100 border-red-500' : 'bg-purple-200 border-gray-300'
              }`}
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <div className="text-red-600 text-xs mt-1 absolute">
                {passwordError}
              </div>
            )}
          </div>

          {/* Password Confirm */}
          <div className="relative w-[500px] m-3">
            <input
              className={`p-3 rounded border w-full h-[50px] ${
                passwordVerifyError ? 'bg-red-100 border-red-500' : 'bg-purple-200 border-gray-300'
              }`}
              type="password"
              placeholder="Password Confirm"
              value={passwordVerify}
              onChange={(e) => setPasswordVerify(e.target.value)}
            />
            {passwordVerifyError && (
              <div className="text-red-600 text-xs mt-1 absolute">
                {passwordVerifyError}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`rounded-lg w-[500px] h-[40px] m-8 text-white ${
              isFormValid && !isSubmitting
                ? 'bg-black hover:bg-gray-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {generalError && (
          <div className="text-red-600 mt-2 max-w-[500px] text-center bg-red-50 p-3 rounded border border-red-300">
            {generalError}
          </div>
        )}

        <div className="text-red mt-4">
          Already have an account? <Link href="/login" className="underline">Sign in</Link>
        </div>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Select Avatar Image</h2>
            <p className="text-sm text-red-600 font-semibold mb-4">
              ⚠️ Image must be EXACTLY 200x200 pixels
            </p>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Upload Custom Avatar (200x200px):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Only images that are exactly 200x200 pixels will be accepted
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Or select a preset (already 200x200):</p>
              <div className="grid grid-cols-4 gap-4">
                <Avatar onSelect={handleAvatarSelect} />
              </div>
            </div>

            <button
              onClick={() => setShowAvatarModal(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 rounded py-2 mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-orange-100 mt-auto">
        <Copyright />
      </div>
    </div>
  );
}