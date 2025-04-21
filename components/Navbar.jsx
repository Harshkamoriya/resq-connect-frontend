"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userRole , setUserRole] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect( ()=>{

    const fetchUserRole = async()=>{
      try {

        const res = await axios.get( `api/fetch-user`)
        const data = res.json();
        console.log(data , "data")
        setUserRole(data.user.role);

      } catch (error) {
        console.log("error aa raha hai bhai user role fetch karte samay")
        console.error("error fetching the user role" , error.message);
      }
    }

    fetchUserRole();
    
  },[]);

  const handleDashboardNavigation = () => {
    if(userRole =="helper"){
      router.push("/helper/dashboard");
    }else { 
      router.push("user-dashboard");
    }
    
    setIsMenuOpen(false); // Close menu on navigation
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ResQ Connect
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={cn(
            "flex-col md:flex md:flex-row md:items-center md:space-x-6",
            isMenuOpen ? "flex" : "hidden",
            "absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent z-50 md:z-auto"
          )}
        >
          <Link
            href="/services"
            className="block px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Apply Helper
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>

        {/* Authentication Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {session ? (
            <>
              <div
                className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full cursor-pointer"
                onClick={handleDashboardNavigation}
              >
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <Button onClick={() => signOut()} className="cursor-pointer">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => signIn()} className="cursor-pointer">
                Login
              </Button>
              <Link href="/auth/signup">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Authentication Buttons */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {session ? (
            <>
              <div
                className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full cursor-pointer mx-auto"
                onClick={handleDashboardNavigation}
              >
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <Button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  signIn();
                  setIsMenuOpen(false);
                }}
                className="w-full"
              >
                Login
              </Button>
              <Link href="/auth/signup">
                <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
