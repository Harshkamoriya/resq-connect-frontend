"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Separator } from "./ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  MapPin,
  Star,
  CreditCard,
  Calendar,
  User,
  Briefcase,
  Loader2,
  ShieldCheck,
  X,
  ThumbsUp,
} from "lucide-react"

export default function JobSummaryModal({ booking, onPay, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showThumbsUp, setShowThumbsUp] = useState(false)
const [open , setOpen] = useState(true)
  const handlePayment = () => {
    setIsLoading(true)
    setTimeout(() => {
      setShowThumbsUp(true)
      setTimeout(() => {
        onPay()
        setIsLoading(false)
      }, 1000)
    }, 1500)
  }
// for handle the modal closing

const handleClose =()=>{
  setOpen(false)
  onClose();
}
  const formattedDate = new Date(booking.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const formattedTime = new Date(booking.createdAt || Date.now()).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Dialog  open={open}  onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[380px] p-5 overflow-hidden">
        <DialogHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-2">
              {showThumbsUp ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <ThumbsUp className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <CheckCircle className="h-6 w-6 text-white" />
              )}
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Job Completed!
            </DialogTitle>
            <p className="text-muted-foreground text-xs mt-1">Your service has been completed successfully</p>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-3"
        >
          <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Avatar className="h-10 w-10 mr-3 ring-2 ring-green-100">
                <AvatarImage
                  src={booking.helperAvatar || "/placeholder.svg?height=40&width=40"}
                  alt={booking.helperName}
                />
                <AvatarFallback className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                  {booking.helperName?.charAt(0) || "H"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-sm">{booking.helperName || "Helper Name"}</h3>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Star className="h-3 w-3 mr-1 text-amber-500 fill-amber-500" />
                  <span>{booking.helperRating || "4.8"} Rating</span>
                </div>
              </div>
              <Badge variant="outline" className="ml-auto text-xs bg-green-50 text-green-700 border-green-200">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>

            <Separator className="my-2 bg-green-100" />

            <div className="space-y-2 text-xs">
              <InfoRow
                icon={<Briefcase className="h-3.5 w-3.5 text-green-600" />}
                label="Issue"
                value={booking.issueDescription || "N/A"}
              />
              <InfoRow icon={<Calendar className="h-3.5 w-3.5 text-green-600" />} label="Date" value={formattedDate} />
              <InfoRow icon={<Clock className="h-3.5 w-3.5 text-green-600" />} label="Time" value={formattedTime} />
            
              <InfoRow icon={<User className="h-3.5 w-3.5 text-green-600" />} label="Email" value={booking.userEmail} />
              <InfoRow
                icon={<CheckCircle className="h-3.5 w-3.5 text-green-600" />}
                label="Status"
                value={booking.workStatus}
              />
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 shadow-sm">
            <h3 className="font-medium mb-2 text-sm text-green-800">Payment Summary</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Charge</span>
                <span>₹{booking.serviceCharge || ((booking.amount || 0) * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span>₹{booking.platformFee || ((booking.amount || 0) * 0.1).toFixed(2)}</span>
              </div>
              <Separator className="my-1.5 bg-green-100" />
              <div className="flex justify-between font-medium text-sm">
                <span>Total Amount</span>
                <span className="text-green-700">₹{booking.amount || 0}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-1.5" />
              )}
              {isLoading ? "Processing..." : "Pay Now"}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: 0 }}
                animate={isLoading ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 1.5 }}
              />
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-[10px] text-center text-muted-foreground mt-1">
              Secured by <span className="font-medium text-green-700">PaySecure</span> • All transactions are encrypted
            </p>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  )
}
