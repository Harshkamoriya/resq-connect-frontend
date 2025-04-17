"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Separator } from "./ui/separator"
import axios from "axios"
import OtpVerificationModal from "./otpModal"
import { MapPin, Phone, User, Wrench, DollarSign, CheckCircle2, Shield, Car } from "lucide-react"

export default function HelperBookingComponent({ booking }) {
  const [workStatus, setWorkStatus] = useState(booking.workStatus)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const bookingId = booking.bookingId

  // Random taglines for different statuses
  const statusTaglines = {
    "not-started": ["Ready to provide roadside assistance!", "Help is on the way!", "Your rescue mission awaits!"],
    "in-progress": [
      "Working on getting you back on the road!",
      "Rescue in progress!",
      "Solving your vehicle issues now!",
    ],
    completed: [
      "Another successful rescue completed!",
      "Back on the road, mission accomplished!",
      "Thank you for trusting ResQ-Connect!",
    ],
  }

  // Get random tagline based on current status
  const getRandomTagline = () => {
    const taglines = statusTaglines[workStatus] || []
    return taglines[Math.floor(Math.random() * taglines.length)]
  }

  const [tagline, setTagline] = useState("")

  useEffect(() => {
    setTagline(getRandomTagline())
  }, [workStatus])

  const handleReached = async () => {
    try {
      const res = await axios.put(`/api/bookings/${bookingId}`, {
        workStatus: "in-progress",
      })
      setWorkStatus(res.data.workStatus)
    } catch (err) {
      console.error("Failed to update work status:", err)
    }
  }

  const handleCompletedClick = () => {
    setShowOtpModal(true)
  }

  const handleOtpVerified = async () => {
    try {
      const res = await axios.put(`/api/bookings/${bookingId}`, {
        workStatus: "completed",
      })
      setWorkStatus(res.data.workStatus)
    } catch (err) {
      console.error("Failed to update work status:", err)
    }
  }

  // Status badge color mapping
  const statusColors = {
    "not-started": "bg-amber-100 text-amber-800 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
  }

  // Status display text mapping
  const statusDisplay = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2 border-blue-100 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Car className="h-5 w-5" />
                <CardTitle className="text-xl">Booking Details</CardTitle>
              </div>
              <p className="text-blue-100 text-sm">{tagline}</p>
            </div>
            <Badge className={`${statusColors[workStatus]} border px-3 py-1 font-medium`}>
              {statusDisplay[workStatus]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center"
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{booking?.user.name}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{booking?.user?.phone}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center"
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{booking?.user?.location?.name}</p>
              </div>
            </motion.div>

            <Separator className="my-2" />

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">Mechanic</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${booking?.priceToPay}</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4"
            >
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  {workStatus === "not-started" && "Customer is waiting for your arrival"}
                  {workStatus === "in-progress" && "You're currently working on this service"}
                  {workStatus === "completed" && "This service has been successfully completed"}
                </p>
              </div>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 px-6 py-4">
          <AnimatePresence mode="wait">
            {workStatus === "not-started" && (
              <motion.div
                key="not-started"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleReached}>
                  <MapPin className="mr-2 h-4 w-4" /> Mark as Reached
                </Button>
              </motion.div>
            )}

            {workStatus === "in-progress" && (
              <motion.div
                key="in-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleCompletedClick}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                </Button>
              </motion.div>
            )}

            {workStatus === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex justify-center"
              >
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  <span className="font-medium">Service Successfully Completed</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpVerificationModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          bookingId={bookingId}
          onVerified={handleOtpVerified}
        />
      )}
    </motion.div>
  )
}
