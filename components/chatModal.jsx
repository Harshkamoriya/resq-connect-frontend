"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Smile, Paperclip, Image } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function ChatModal({ isOpen, onClose, messages, onSend }) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    onSend(newMessage);
    setNewMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
              <AvatarFallback>HP</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg">Helper Professional</DialogTitle>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[400px] rounded-md overflow-hidden bg-secondary/10">
          <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] group flex items-end gap-2 ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {msg.sender !== "user" && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
                        <AvatarFallback>HP</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {msg.text}
                      <span className="text-[10px] ml-2 opacity-50">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                Helper is typing
              </motion.div>
            )}
          </ScrollArea>

          <div className="p-4 bg-background border-t">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 1000);
                  }}
                  placeholder="Type your message..."
                  className="pr-24"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSend} size="icon" className="h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}