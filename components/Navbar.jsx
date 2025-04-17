"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useRouter } from "next/navigation";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle,NavigationMenuIndicator } from "./ui/navigation-menu";
import { useSession , signIn,signOut } from "next-auth/react";

export default function Navbar() {
  const {data :session} = useSession();
  console.log(session)
  const router = useRouter();
  const handleClick=()=>{
    router.push('/helper/dashboard')
  }
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ResQ Connect
        </Link>

        {/* Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <Link href="/services" className={cn("text-gray-700 hover:text-blue-600 transition")}>
                Services
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className={cn("text-gray-700 hover:text-blue-600 transition")}>
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" className={cn("text-gray-700 hover:text-blue-600 transition")}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Buttons */}
        <div className="flex space-x-4 items-center">
          {session ? (
            <>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full  cursor-pointer" onClick={()=>{handleClick()}}>
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <Button onClick={() => signOut()} className="  cursor-pointer ">Logout</Button>
            </>
          ) : (
            <>
              <Button onClick={() => signIn()} className="cursor-pointer">Login</Button>
              <Button className=" cursor-pointer">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
