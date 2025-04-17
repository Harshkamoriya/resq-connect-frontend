"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Hero() {

  const router = useRouter();
  const handleAssistance  =()=>{
    router.push('/Assistance');
  }
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-white-900 text-black">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.jpg" // Add your background image in the public folder
          alt="Roadside Assistance"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      </div>

      {/* Hero Content */}
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          AI-Driven Roadside Assistance, Anytime, Anywhere
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Get help instantly with our smart matching system and real-time updates.
        </p>
        <Button onClick={handleAssistance}  className="mt-6 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 cursor-pointer "  >
          Get Assistance Now
        </Button>
      </div>
    </section>
  );
}
