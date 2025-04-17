import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo & Description */}
        <div>
          <h2 className="text-xl font-bold">ResQ Connect</h2>
          <p className="text-gray-400 mt-2">
            Your trusted roadside assistance platform. Get help anywhere, anytime.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-gray-400 mt-2">Email: support@resqconnect.com</p>
          <p className="text-gray-400">Phone: +91 98765 43210</p>

          {/* Social Media Icons */}
          <div className="mt-4 flex space-x-4">
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-400" />
            </Link>
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-600" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-6 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} ResQ Connect. All rights reserved.
      </div>
    </footer>
  );
}
