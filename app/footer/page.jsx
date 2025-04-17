'use client';

import Link from 'next/link';
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Wrench,
  Users,
  Info,
  Contact,
  Settings,
  UserCircle,
  Building2
} from "lucide-react";

const Footer = () => {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-950 to-black text-white relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            className="space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RoadSide Assist
            </h3>
            <p className="text-gray-300">
              24/7 emergency roadside assistance you can count on. We're here when you need us most.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <Info className="h-4 w-4 mr-2" />
                  About Us
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <Settings className="h-4 w-4 mr-2" />
                  Our Services
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <Contact className="h-4 w-4 mr-2" />
                  Contact
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div 
            className="space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h4 className="text-lg font-semibold">Join Us</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/apply" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <Wrench className="h-4 w-4 mr-2" />
                  Apply as Helper
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/business" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Partnership
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/assistance" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <Users className="h-4 w-4 mr-2" />
                  Get Assistance
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span>1-800-ROADHELP</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span>help@roadassist.com</span>
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                <span>123 Service Road, City, State</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-800"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RoadSide Assist. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;