'use client';

import { useState } from 'react';
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { motion } from "framer-motion";
import { Phone, Wrench, Fuel, Truck, MapPin, Mail, Clock, PhoneCall } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  const services = [
    { icon: Wrench, title: "Mechanical Help", description: "On-spot repairs and mechanical assistance" },
    { icon: Truck, title: "Towing Service", description: "24/7 towing service for all vehicle types" },
    { icon: Fuel, title: "Fuel Delivery", description: "Emergency fuel delivery when you run dry" },
    { icon: Phone, title: "Flat Tire", description: "Quick tire change and repair service" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            24/7 Roadside Assistance
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">We're here to help you get back on the road</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 bg-white/50 dark:bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-full">
                  <PhoneCall className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Emergency Hotline</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">1-800-ROADHELP</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/50 dark:bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">123 Service Road, City, State</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/50 dark:bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">help@roadassist.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/50 dark:bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">24/7 Service</h3>
                  <p className="text-gray-600 dark:text-gray-300">Always available for you</p>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/70 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-full w-fit mb-4">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{service.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="firstName">First name</label>
                      <Input id="firstName" placeholder="John" className="bg-white/50 dark:bg-gray-700/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="lastName">Last name</label>
                      <Input id="lastName" placeholder="Doe" className="bg-white/50 dark:bg-gray-700/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="email">Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white/50 dark:bg-gray-700/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="phone">Phone</label>
                    <Input id="phone" type="tel" placeholder="(123) 456-7890" className="bg-white/50 dark:bg-gray-700/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="service">Service needed</label>
                    <select 
                      id="service" 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                    >
                      <option value="">Select a service</option>
                      <option value="towing">Towing Service</option>
                      <option value="flat-tire">Flat Tire</option>
                      <option value="fuel">Fuel Delivery</option>
                      <option value="mechanical">Mechanical Help</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="message">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Please describe your situation..."
                      className="min-h-[100px] bg-white/50 dark:bg-gray-700/50"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}