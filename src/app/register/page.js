"use client";

import AppBanner from "@/components/AppBanner";
import Copyright from "@/components/Copyright";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/auth";

export default function Register() {
  const { auth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    await auth.loginUser(email, password);
  }

  return (
    <div>
      <AppBanner/>
      Placeholder
    </div>
  );
}
