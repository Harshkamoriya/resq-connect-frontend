"use client";

import { useState } from "react";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Signup Form Submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success("Signup successful! You can now log in.");
      router.push("/auth/signin");
    } else {
      toast.error(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Create an Account</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <Input name="name" type="text" placeholder="Full Name" onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <Input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} required />
          
          {/* Role Selection */}
          <select name="role" onChange={handleChange} className="w-full p-2 border rounded-lg">
            <option value="customer">Customer</option>
            <option value="helper">Helper</option>
          </select>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Signup Button */}
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100"
        >
          <FcGoogle className="text-xl" /> Sign up with Google
        </Button>
      </div>
    </div>
  );
}
