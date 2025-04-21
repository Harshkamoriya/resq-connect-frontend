"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useAppContext } from "app/context/Appcontext"

// Components
import ChatModalWrapper from "components/wrappers/chatModelWrapper"
import MapComponent from "components/MapComponent"
import HelperLocationEmitter from "components/HelperLocationEmitter"
import JobSummaryModal from "components/Payment"
import BeforeStartComponent from "components/BeforeStartComponent"
import RatingModal from "components/RateModal"

// UI Components
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Textarea } from "components/ui/textarea"
import { Badge } from "components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { Progress } from "components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"

// Icons
import {
  Car,
  MapPin,
  Phone,
  Star,
  MessageSquare,
  Clock,
  PenToolIcon as Tool,
  Fuel,
  Truck,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

export default function BookPage() {
  // State variables
  const [issue, setIssue] = useState("")
  const [location, setLocation] = useState("")
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [issueType, setIssueType] = useState("")
  const [loading, setLoading] = useState(false)
  const [helpersDetails, setHelpersDetails] = useState([])
  const [helperInfo, setHelperInfo] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [progress, setProgress] = useState(otpStep ? 75 : 25)
  const [isLoading, setIsLoading] = useState(false)
  const [booking, setBooking] = useState({})
  const [bookingId, setBookingId] = useState("")
  const [chatOpen, setChatOpen] = useState(false)
  const [showJobSummary, setShowJobSummary] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState(null)

  // Hooks
  const router = useRouter()
  const params = useParams()
  const helperId = params.bookingId
  const { data: session, status } = useSession()
  const { userInfo } = useAppContext()
  const pollingRef = useRef(null)

  const {user } = useAppContext();


  // Mock messages for chat
  const [messages, setMessages] = useState([
    { sender: "helper", text: "I am on the way" },
    { sender: "user", text: "Okay take your time" },
  ])

  // Fetch helper information
  useEffect(() => {
    const fetchHelperInfo = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/helpers/${helperId}`)
        const data = await res.json()
        setHelperInfo(data)
      } catch (error) {
        console.error("Error fetching helper", error)
        toast.error("Couldn't load helper details")
      } finally {
        setLoading(false)
      }
    }

    if (helperId) {
      fetchHelperInfo()
    }
  }, [helperId])

  // Get user location from localStorage
  useEffect(() => {
    try {
      const userLocationStr = localStorage.getItem("userLocation")
      if (userLocationStr) {
        const parsedData = JSON.parse(userLocationStr)
        setUserData(parsedData)
        setLocation(parsedData.name || "")
      }

      if (session?.user?.email) {
        setEmail(session.user.email)
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error)
    }
  }, [session])

  // Load helpers details from localStorage
  useEffect(() => {
    try {
      const helpersStr = localStorage.getItem("helpersDetails")
      if (helpersStr) {
        const parsedHelpers = JSON.parse(helpersStr)
        setHelpersDetails(parsedHelpers)
      }
    } catch (error) {
      console.error("Error parsing helpers data:", error)
    }
  }, [])

  // Polling to fetch the booking workstatus continuously
  useEffect(() => {
    if (!bookingId) return

    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/booking/details/${bookingId}`)
        if (res.status === 200) {
          const updatedBooking = res.data.booking

          setBooking((prev) => {
            if (prev.workStatus !== updatedBooking.workStatus) {
              return updatedBooking
            }
            return prev
          })

          // Stop polling if job is completed
          if (updatedBooking.workStatus === "completed") {
            clearInterval(pollingRef.current)
          }
        }
      } catch (err) {
        console.error("Error polling booking status:", err)
      }
    }, 3000)

    return () => clearInterval(pollingRef.current)
  }, [bookingId])

  // Check if work status is completed
  useEffect(() => {
    if (booking.workStatus === "completed") {
      setShowJobSummary(true)
    }
  }, [booking.workStatus])

  // Handle booking request
  const handleBook = async () => {
    if (!issue || !issueType) {
      toast.error("Please describe your issue and select an issue type.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/book-helper/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session?.user?.email,
          helperId,
          issueDescription: issue,
          issueType: issueType,
          location: userData?.name || location,
          email: session?.user?.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Booking failed")
        return
      }

      setBookingId(data.bookingId)
      setOtpStep(true)
      setProgress(75)
      toast.success("OTP sent! Check your messages.")
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong while booking.")
    } finally {
      setLoading(false)
    }
  }

  // Send notification
  const sendNotification = async () => {
    try {
      const res = await axios.post(
        "/api/notifications/send",
        { bookingId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } catch (error) {
      console.error("Error sending the notification:", error.message)
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/book-helper/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, otp }),
      })

      const data = await res.json()
      setBooking(data.bookingData)
      sendNotification()

      if (res.ok) {
        toast.success("Booking confirmed!")
        localStorage.removeItem("userLocation")
        setProgress(100)
      } else {
        toast.error(data.error || "Invalid OTP")
      }
    } catch (err) {
      console.error(err)
      toast.error("OTP verification failed.")
    } finally {
      setLoading(false)
    }
  }

  // Handle payment
  const handlePayment = async () => {
    try {
      console.log("payment successful")
      toast.success("Payment successful")
      setShowJobSummary(false)
      setShowModal(true)
    } catch (error) {
      console.log("payment unsuccessful ", error.message)
    }
  }

  // Handle chat
  const handleChatClick = () => {
    setChatOpen(true)
  }

  const handleSendMessage = (msg) => {
    setMessages([...messages, { sender: "user", text: msg }])
    // Optionally: emit to backend here
  }

  // Get service icon based on helper type or issue type
  const getServiceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "mechanic":
        return <Tool className="h-5 w-5" />
      case "fuel":
        return <Fuel className="h-5 w-5" />
      case "tow":
        return <Truck className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  // Determine which component to render based on booking status
  let renderComponent = null

  if (booking.bookingStatus === "confirmed") {
    switch (booking.workStatus) {
      case "not-started":
        renderComponent = (
          <BeforeStartComponent
            otpCode={booking.endOtp}
            helperPhone={booking.helperPhone}
            onChatClick={handleChatClick}
          />
        )
        break

      case "completed":
        renderComponent = (
          <JobSummaryModal booking={booking} onPay={handlePayment} onClose={() => setShowJobSummary(false)} />
        )
        break

      default:
        renderComponent = <p>Waiting for update...</p>
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 text-slate-800">Road Assistance</h1>
          <div className="flex items-center mb-4">
            <Progress value={progress} className="h-2.5 flex-1 bg-slate-200" />
            <span className="ml-2 text-sm font-medium text-slate-600">{progress}%</span>
          </div>
          <p className="text-slate-600">
            {otpStep
              ? "Verify your booking with the OTP sent to your phone"
              : "Book a roadside assistance professional to help with your vehicle"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Booking form or OTP verification */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800">
                  {!otpStep ? "Request Assistance" : "Verify Your Booking"}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {!otpStep ? "Tell us about your vehicle issue" : "Enter the 4-digit code sent to your phone"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!otpStep ? (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="issue-type" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Issue Type
                      </label>
                      <Select value={issueType} onValueChange={setIssueType}>
                        <SelectTrigger id="issue-type" className="bg-white border-slate-300">
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat_tire">Flat Tire</SelectItem>
                          <SelectItem value="battery">Dead Battery</SelectItem>
                          <SelectItem value="fuel">Out of Fuel</SelectItem>
                          <SelectItem value="tow">Need a Tow</SelectItem>
                          <SelectItem value="lockout">Locked Out</SelectItem>
                          <SelectItem value="mechanical">Mechanical Issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="issue-description" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Issue Description
                      </label>
                      <Textarea
                        id="issue-description"
                        placeholder="Please describe your issue in detail"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        rows={4}
                        className="resize-none border-slate-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Your Location
                      </label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <Input
                          id="location"
                          placeholder="Confirm your location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          disabled={userData?.name}
                          className="border-slate-300"
                        />
                      </div>
                      {userData?.name && (
                        <p className="text-xs text-slate-500 mt-1.5">Location detected automatically</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="text-center mb-5">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-slate-600">
                        We've sent a 4-digit code to your registered phone number
                      </p>
                    </div>

                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Enter OTP
                      </label>
                      <Input
                        id="otp"
                        placeholder="4-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                        maxLength={4}
                        className="text-center text-2xl tracking-widest border-slate-300"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!otpStep ? (
                  <Button
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
                    onClick={handleBook}
                    disabled={loading || !issue || !issueType}
                  >
                    {loading ? "Processing..." : "Request Assistance"}
                  </Button>
                ) : (
                  <Button
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 4}
                  >
                    {loading ? "Verifying..." : "Confirm Booking"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Emergency contacts card */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-800">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-red-50 rounded-md">
                    <Phone className="h-4 w-4 mr-3 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Emergency: 911</span>
                  </div>
                  <div className="flex items-center p-2 bg-blue-50 rounded-md">
                    <Phone className="h-4 w-4 mr-3 text-blue-600" />
                    <span className="text-sm text-blue-700">Customer Support: 1-800-ROAD-HELP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Helper details and map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Helper details card */}
            {helperInfo && (
              <Card className="shadow-sm border-slate-200 overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-slate-800">Helper Details</CardTitle>
                      <CardDescription className="text-slate-600">Professional road assistance</CardDescription>
                    </div>
                    <Badge
                      variant={helperInfo.isAvailable ? "default" : "secondary"}
                      className={helperInfo.isAvailable ? "bg-green-500" : ""}
                    >
                      {helperInfo.isAvailable ? "Available" : "Busy"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-5 w-full justify-start bg-slate-100 p-1">
                      <TabsTrigger value="details" className="data-[state=active]:bg-white">
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="data-[state=active]:bg-white">
                        Stats
                      </TabsTrigger>
                      <TabsTrigger value="reviews" className="data-[state=active]:bg-white">
                        Reviews
                      </TabsTrigger>
                      <TabsTrigger value="services" className="data-[state=active]:bg-white">
                        Services
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex-shrink-0">
                          <Avatar className="h-24 w-24 border-2 border-blue-100 rounded-lg">
                            <AvatarImage
                              src={
                                helperInfo.profileImage || "/placeholder.svg?height=96&width=96" || "/placeholder.svg"
                              }
                              alt={helperInfo.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                              {helperInfo.name?.charAt(0) || "H"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-slate-800 mb-2">{helperInfo.name}</h3>

                          <div className="flex items-center mb-4">
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                              <span className="font-medium text-yellow-700">{helperInfo.ratings || "4.8"}</span>
                              <span className="text-slate-600 text-sm ml-1">
                                ({helperInfo.completedJobs?.length || "24"} jobs)
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center bg-slate-50 p-2 rounded-md">
                              <div className="mr-3 bg-blue-100 p-1.5 rounded-full">
                                {getServiceIcon(helperInfo.serviceType || "mechanic")}
                              </div>
                              <span className="text-sm font-medium text-slate-700 capitalize">
                                {helperInfo.serviceType || "Mechanic"}
                              </span>
                            </div>

                            <div className="flex items-center bg-slate-50 p-2 rounded-md">
                              <div className="mr-3 bg-blue-100 p-1.5 rounded-full">
                                <MapPin className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm text-slate-700">{helperInfo.city || "Downtown"}</span>
                            </div>

                            <div className="flex items-center bg-slate-50 p-2 rounded-md">
                              <div className="mr-3 bg-blue-100 p-1.5 rounded-full">
                                <Clock className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm text-slate-700">
                                Response time: ~{Math.floor(Math.random() * 15) + 5} min
                              </span>
                            </div>

                            <div className="flex items-center bg-slate-50 p-2 rounded-md">
                              <div className="mr-3 bg-blue-100 p-1.5 rounded-full">
                                <Phone className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm text-slate-700">{helperInfo.phone || "Contact via app"}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <h4 className="font-medium mb-3 text-slate-800">Service Status</h4>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge
                                variant="outline"
                                className={`px-3 py-1 ${
                                  helperInfo.availability
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                {helperInfo.availability ? "Available Now" : "Busy"}
                              </Badge>

                              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                <span className="text-sm mr-2 text-blue-700">Total Earnings:</span>
                                <span className="font-medium text-blue-700">
                                  ${helperInfo.totalEarnings?.toLocaleString() || "2,450"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="stats">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Card className="border-slate-200 bg-gradient-to-b from-white to-slate-50">
                            <CardHeader className="py-3 pb-1">
                              <CardTitle className="text-base text-center text-slate-700">Completed Jobs</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 text-center">
                              <p className="text-3xl font-bold text-blue-600">
                                {helperInfo.completedJobs?.length || 0}
                              </p>
                              <p className="text-xs text-slate-500">Total services provided</p>
                            </CardContent>
                          </Card>

                          <Card className="border-slate-200 bg-gradient-to-b from-white to-slate-50">
                            <CardHeader className="py-3 pb-1">
                              <CardTitle className="text-base text-center text-slate-700">Rating</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 text-center">
                              <div className="flex items-center justify-center">
                                <p className="text-3xl font-bold text-blue-600 mr-1">
                                  {helperInfo.ratings?.toFixed(1) || "5.0"}
                                </p>
                                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                              </div>
                              <p className="text-xs text-slate-500">Customer satisfaction</p>
                            </CardContent>
                          </Card>

                          <Card className="border-slate-200 bg-gradient-to-b from-white to-slate-50">
                            <CardHeader className="py-3 pb-1">
                              <CardTitle className="text-base text-center text-slate-700">Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 text-center">
                              <p className="text-3xl font-bold text-blue-600">
                                {helperInfo.completedJobs?.length > 50
                                  ? "Expert"
                                  : helperInfo.completedJobs?.length > 20
                                    ? "Pro"
                                    : "Regular"}
                              </p>
                              <p className="text-xs text-slate-500">Service level</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 text-slate-700">Service History</h3>
                          <div className="space-y-3">
                            {helperInfo.completedJobs && helperInfo.completedJobs.length > 0 ? (
                              helperInfo.completedJobs.slice(0, 3).map((job, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between border border-slate-200 rounded-md p-3 bg-white hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                      {job.serviceType === "mechanic" && <Tool className="h-4 w-4 text-blue-600" />}
                                      {job.serviceType === "fuel" && <Fuel className="h-4 w-4 text-blue-600" />}
                                      {job.serviceType === "tow" && <Truck className="h-4 w-4 text-blue-600" />}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium capitalize text-slate-700">
                                        {job.serviceType} Service
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {new Date(job.completionTime).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 border border-slate-200 rounded-md bg-slate-50">
                                <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                                <p className="text-slate-500">No service history available</p>
                              </div>
                            )}
                          </div>

                          {helperInfo.completedJobs && helperInfo.completedJobs.length > 3 && (
                            <Button
                              variant="ghost"
                              className="w-full text-sm mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              size="sm"
                            >
                              View all {helperInfo.completedJobs.length} services
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 text-slate-700">Service Breakdown</h3>
                          <div className="space-y-3">
                            {["mechanic", "fuel", "tow"].map((type) => {
                              const count =
                                helperInfo.completedJobs?.filter((job) => job.serviceType === type).length || 0
                              const percentage = helperInfo.completedJobs?.length
                                ? Math.round((count / helperInfo.completedJobs.length) * 100)
                                : 0

                              return (
                                <div key={type} className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                                        {type === "mechanic" && <Tool className="h-4 w-4 text-blue-600" />}
                                        {type === "fuel" && <Fuel className="h-4 w-4 text-blue-600" />}
                                        {type === "tow" && <Truck className="h-4 w-4 text-blue-600" />}
                                      </div>
                                      <span className="text-sm capitalize text-slate-700">{type}</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">{count} jobs</span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div
                                      className="bg-blue-600 h-2.5 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                      <div className="space-y-4">
                        {helperInfo.reviews && helperInfo.reviews.length > 0 ? (
                          helperInfo.reviews.slice(0, 3).map((review, index) => (
                            <div key={index} className="border-b border-slate-200 pb-4 last:border-0">
                              <div className="flex items-center mb-2">
                                <Avatar className="h-10 w-10 mr-3 border border-slate-200">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {review.user?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm text-slate-800">
                                    {review.user || "Anonymous User"}
                                  </p>
                                  <div className="flex items-center">
                                    {Array(5)
                                      .fill(0)
                                      .map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3.5 w-3.5 ${
                                            i < (review.rating || 5) ? "text-yellow-500" : "text-slate-300"
                                          }`}
                                          fill={i < (review.rating || 5) ? "currentColor" : "none"}
                                        />
                                      ))}
                                    <span className="text-xs text-slate-500 ml-2">{review.date || "2 weeks ago"}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 pl-13">
                                {review.text || "Great service, arrived quickly and fixed my issue!"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-slate-50 rounded-lg">
                            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No reviews yet</p>
                          </div>
                        )}

                        {helperInfo.reviews && helperInfo.reviews.length > 3 && (
                          <Button
                            variant="ghost"
                            className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            size="sm"
                          >
                            View all {helperInfo.reviews.length} reviews
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="services">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                          <CardHeader className="py-4">
                            <div className="flex items-center">
                              <div className="mr-3 bg-blue-100 p-2.5 rounded-full">
                                <Tool className="h-5 w-5 text-blue-600" />
                              </div>
                              <CardTitle className="text-base text-slate-800">Mechanical Repairs</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-slate-600">Basic repairs to get your vehicle running again</p>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                          <CardHeader className="py-4">
                            <div className="flex items-center">
                              <div className="mr-3 bg-blue-100 p-2.5 rounded-full">
                                <Fuel className="h-5 w-5 text-blue-600" />
                              </div>
                              <CardTitle className="text-base text-slate-800">Fuel Delivery</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-slate-600">Emergency fuel when you're stranded</p>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                          <CardHeader className="py-4">
                            <div className="flex items-center">
                              <div className="mr-3 bg-blue-100 p-2.5 rounded-full">
                                <Truck className="h-5 w-5 text-blue-600" />
                              </div>
                              <CardTitle className="text-base text-slate-800">Towing Service</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-slate-600">Towing to nearest service center</p>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                          <CardHeader className="py-4">
                            <div className="flex items-center">
                              <div className="mr-3 bg-blue-100 p-2.5 rounded-full">
                                <Car className="h-5 w-5 text-blue-600" />
                              </div>
                              <CardTitle className="text-base text-slate-800">Tire Change</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-slate-600">Quick tire replacement or repair</p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Map card */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-slate-50">
                <CardTitle className="text-slate-800">Location</CardTitle>
                <CardDescription className="text-slate-600">Your location and nearby helpers</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden rounded-b-lg h-[350px]">
                {userData?.lat && userData?.lon ? (
                  <MapComponent userLat={userData.lat} userLon={userData.lon} helpers={helpersDetails || [] } selectedHelperId={helperId} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">Location data unavailable</p>
                      <p className="text-sm text-slate-400 mt-1">Please enable location services</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking status and modals */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          {renderComponent || (
            <div className="text-center py-4">
              <p className="text-slate-600">No active booking...</p>
              <p className="text-sm text-slate-500 mt-1">Complete the form to request assistance</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      <div className="fixed bottom-0 right-0 z-50">
        <ChatModalWrapper
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          bookingId={booking._id}
          currentUser={user}
        />
      </div>

      {/* Job Summary Modal */}
      {showJobSummary && (
        <JobSummaryModal booking={booking} onPay={handlePayment} onClose={() => setShowJobSummary(false)} />
      )}

      {/* Rating Modal */}
      {showModal && <RatingModal isOpen={showModal} onClose={() => setShowModal(false)} bookingId={bookingId} />}

      {/* Hidden component for location tracking */}
      {session?.user?.id && <HelperLocationEmitter helperId={session.user.id} />}
    </div>
  )
}
