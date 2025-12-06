"use client";

import AppBanner from "@/components/AppBanner";
import Copyright from "@/components/Copyright";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/auth";
import { useRouter } from "next/navigation";

export default function EditAccount() {
  const { auth } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.loggedIn) {
      router.push("/login");
    }
  }, [auth.loggedIn, router]);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [avatar, setAvatar] = useState("");

  // Field-level validation errors
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerifyError, setPasswordVerifyError] = useState("");
  const [avatarError, setAvatarError] = useState("");

  // General error/success
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with current user data
  useEffect(() => {
    if (auth.user) {
      setUserName(auth.user.userName || "");
      setAvatar(auth.user.avatar || "");
    }
  }, [auth.user]);

  // Validate userName
  useEffect(() => {
    if (userName.length === 0) {
      setUserNameError("User name is required");
    } else if (userName.trim().length === 0) {
      setUserNameError("User name cannot be empty or whitespace only");
    } else {
      setUserNameError("");
    }
  }, [userName]);

  // Validate password (only if changing)
  useEffect(() => {
    if (password.length === 0) {
      setPasswordError("");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  }, [password]);

  // Validate password verify (only if changing password)
  useEffect(() => {
    if (password.length === 0) {
      setPasswordVerifyError("");
    } else if (passwordVerify.length === 0) {
      setPasswordVerifyError("Please confirm your password");
    } else if (password !== passwordVerify) {
      setPasswordVerifyError("Passwords do not match");
    } else {
      setPasswordVerifyError("");
    }
  }, [password, passwordVerify]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarError("");

    const img = document.createElement('img');
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        // STRICT: Must be exactly 200x200
        if (img.width !== 200 || img.height !== 200) {
          setAvatarError(`Image must be exactly 200x200 pixels (yours is ${img.width}x${img.height})`);
          return;
        }

        // Convert to base64
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        setAvatar(base64);
        setAvatarError("");
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    router.back();
  };

  async function handleUpdate(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");

    try {
      const updateData = {
        userName: userName.trim(),
        avatar: avatar
      };

      if (password.length > 0) {
        updateData.password = password;
        updateData.passwordVerify = passwordVerify;
      }

      const res = await fetch("/api/auth/edit-account", {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      if (res.status === 200) {
        await auth.getLoggedIn();
        router.back();
      } else {
        setGeneralError(data.errorMessage || "Update failed");
      }
    } catch (error) {
      setGeneralError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = 
    userName.trim().length > 0 &&
    avatar.length > 0 &&
    !userNameError &&
    !avatarError &&
    (password.length === 0 || (password.length >= 8 && password === passwordVerify)) &&
    (password.length === 0 || !passwordError) &&
    (password.length === 0 || !passwordVerifyError);

  if (!auth.loggedIn) {
    return null;
  }

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
          Edit Account
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col items-center w-full">
          {/* Avatar Display and Upload */}
          <div className="mb-4 flex flex-col items-center">
            <div className={`w-[100px] h-[100px] rounded-full border-4 overflow-hidden bg-white flex items-center justify-center ${
              avatarError ? 'border-red-500' : 'border-purple-300'
            }`}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            
            <label className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded cursor-pointer transition">
              Change Avatar (200x200px)
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {avatarError && (
              <div className="text-red-600 text-xs mt-2 text-center max-w-[300px]">
                {avatarError}
              </div>
            )}
          </div>

          {/* User Name */}
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

          {/* Email (Read-only per spec) */}
          <div className="relative w-[500px] m-3">
            <input
              className="p-3 rounded border w-full h-[50px] bg-gray-200 border-gray-300 cursor-not-allowed"
              placeholder="Email"
              value={auth.user?.email || ""}
              disabled
              readOnly
            />
            <div className="text-gray-500 text-xs mt-1">
              Email cannot be changed
            </div>
          </div>

          {/* Password (Optional) */}
          <div className="relative w-[500px] m-3">
            <input
              className={`p-3 rounded border w-full h-[50px] ${
                passwordError ? 'bg-red-100 border-red-500' : 'bg-purple-200 border-gray-300'
              }`}
              type="password"
              placeholder="New Password (leave blank to keep current)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <div className="text-red-600 text-xs mt-1 absolute">
                {passwordError}
              </div>
            )}
          </div>

          {/* Password Confirm (Only show if changing password) */}
          {password.length > 0 && (
            <div className="relative w-[500px] m-3">
              <input
                className={`p-3 rounded border w-full h-[50px] ${
                  passwordVerifyError ? 'bg-red-100 border-red-500' : 'bg-purple-200 border-gray-300'
                }`}
                type="password"
                placeholder="Confirm New Password"
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
              />
              {passwordVerifyError && (
                <div className="text-red-600 text-xs mt-1 absolute">
                  {passwordVerifyError}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 m-8">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`rounded-lg w-[240px] h-[40px] text-white ${
                isFormValid && !isSubmitting
                  ? 'bg-black hover:bg-gray-800' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Complete'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg w-[240px] h-[40px] bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>
          </div>
        </form>

        {generalError && (
          <div className="text-red-600 mt-2 max-w-[500px] text-center bg-red-50 p-3 rounded border border-red-300">
            {generalError}
          </div>
        )}
      </div>

      <div className="bg-orange-100 mt-auto">
        <Copyright />
      </div>
    </div>
  );
}