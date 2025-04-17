"use client";

import { useState, useEffect } from "react";
import { Phone, MessageSquare, Shield, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function BeforeStartComponent({ otpCode, helperPhone, onChatClick }) {
  const [timeLeft, setTimeLeft] = useState("10:00");

  useEffect(() => {
    let minutes = 9;
    let seconds = 59;
    
    const timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gradient-to-b from-background to-secondary/20"
    >
      <Card className="w-full max-w-md shadow-2xl border border-gray-200/50 backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-2">
          <motion.div variants={itemVariants} className="flex justify-center">
            <Badge variant="secondary" className="mb-2">
              <Clock className="w-3 h-3 mr-1" />
              Helper arrives in {timeLeft}
            </Badge>
          </motion.div>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Your Helper is on the Way!
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Professional assistance is just moments away
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-secondary/50 rounded-lg p-6 space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure OTP Code</span>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold tracking-[0.3em] text-primary bg-primary/5 py-3 rounded-md">
                {otpCode}
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Share this code with your helper to verify their identity
            </p>
          </motion.div>

          <Separator />

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Professional • Background Verified • 4.8★
              </span>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex gap-2 items-center hover:scale-105 transition-transform"
                onClick={() => window.open(`tel:${helperPhone}`)}
              >
                <Phone className="w-4 h-4" />
                Call Helper
              </Button>

              <Button
                variant="default"
                size="lg"
                className="flex gap-2 items-center hover:scale-105 transition-transform"
                onClick={onChatClick}
              >
                <MessageSquare className="w-4 h-4" />
                Chat Now
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}