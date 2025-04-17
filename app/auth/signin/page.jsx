"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import Navbar from "components/Navbar";
import Footer from "components/ui/Footer";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Manual Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Login successful!", description: "Welcome back!" });
      router.push("/");
    }
  };

  return (
    <>  
    <Navbar/>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100  cursor-pointer" 
        >
          <FcGoogle className="text-xl" /> Sign up with Google
        </Button>
      </div>
    </div>
    <Footer/>
    </>

  );
}
