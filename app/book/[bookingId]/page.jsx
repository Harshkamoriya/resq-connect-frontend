"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import ChatModalWrapper from "components/wrappers/chatModelWrapper";
import MapComponent from "components/MapComponent";
import HelperLocationEmitter from "components/HelperLocationEmitter";
import JobSummaryModal from "components/Payment";
import axios from "axios";
import Head from "next/head";
import { loadRazorpayScript } from "lib/loadRazorpay";

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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Badge } from "components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Progress } from "components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import BeforeStartComponent from "components/BeforeStartComponent";
import ChatModal from "components/chatModal";
import RatingModal from "components/RateModal";
import { useAppContext } from "app/context/Appcontext";

export default function BookPage() {
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpersDetails, setHelpersDetails] = useState([]);
  const [helperInfo, setHelperInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [progress, setProgress] = useState(otpStep ? 75 : 25);
  const [isLoading, setIsLoading] = useState(false);

  // booking related variables
  const [booking, setBooking] = useState({});
  const [bookingId, setBookingId] = useState("");

  const router = useRouter();
  const params = useParams();
  const helperId = params.bookingId;
  const { data: session, status } = useSession();
  const {userInfo} = useAppContext();

  // chat modal variables
  const [chatOpen, setChatOpen] = useState(false);
  // payment modal variables
  const [showJobSummary, setShowJobSummary] = useState(false);

  const pollingRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "helper",
      text: "I am on the way",
      text: "i am on the way",
    },
    { sender: "user", text: "Okay take your time" },
  ]);

  // Get user location from localStorage
  const [userData, setUserData] = useState(null);
console.log(userInfo  ," userInfo ")
  // rating modal variable

  const [showModal, setShowModal] = useState(false);

  console.log(booking, "booking data");

  const handleChatClick = () => {
    console.log("open chat modal");
    setChatOpen(true);
  };

  const handleSendMessage = (msg) => {
    setMessages([...messages, { sender: "user", text: msg }]);
    // Optionally: emit to backend here
  };



  // polling to fetch the booking workstatus continuously

  useEffect(() => {
    console.log("booking ", booking);
    console.log(bookingId, "booking id in the polling");

    if (!bookingId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/booking/details/${bookingId}`);
        console.log(res, "res of setinterval polling");
        if (res.status === 200) {
          const updatedBooking = res.data.booking;

          setBooking((prev) => {
            if (prev.workStatus !== updatedBooking.workStatus) {
              return updatedBooking;
            }
            return prev;
          });

          // 🛑 Stop polling if job is completed
          if (updatedBooking.workStatus === "completed") {
            clearInterval(pollingRef.current);
          }
        }
      } catch (err) {
        console.error("Error polling booking status:", err);
      }
    }, 3000);

    return () => clearInterval(pollingRef.current);
  }, [bookingId]);

  // useffecrt to check the workstatus is being stored in the booking.workstatus

  useEffect(() => {
    if (booking.workStatus === "completed") {
      console.log(showJobSummary, "showjobsummary");
      setShowJobSummary(true);
    }
  }, [booking.workStatus]);

  console.log(userInfo , "userinfo in handlepayment");

  // handling razorpayment gateway

  const handlePayment = async () => {
    setIsLoading(true);
    console.log("in the handlepayment function");

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }

    // Step 1: Fetch booking details (amount, etc.)
    const bookingRes = await fetch(`/api/booking/details/${bookingId}`);
    console.log(bookingRes, " booking response");
    const booking = await bookingRes.json();
    console.log(booking, "booking data in handlepayment");
    console.log(booking.booking.amount, "booking amount ");

    console.log(booking, "booking data from local state");
    const amount = booking.booking.amount;
    // Step 2: Create Razorpay order from your API
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount, // in rupees
        receipt: `receipt_${bookingId}`,
      }),
    });

    const order = await orderRes.json();
    console.log(order, "order ");

    if (!order.id) {
      alert("Failed to create order");
      setIsLoading(false);
      return;
    }

    // Step 3: Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "ResQ Connect",
      description: "Roadside Assistance Payment",
      order_id: order.id,
      handler: async function (response) {
        // Step 4: Verify payment
        console.log(options, "order options");

        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        console.log("verifyRes ", verifyRes);

        const verifyData = await verifyRes.json();

        console.log("verifyData", verifyData);
        if (verifyData.success) {
         
          localStorage.setItem("showReviewModal", "true");
          localStorage.setItem("showJobSummaryModal", "true");

          localStorage.setItem("bookingIdForReview", bookingId); // persist booking ID
          window.location.reload();
          setShowJobSummary(false);
        }
        else {
          alert("Payment verification failed!");
        }
      },
    
        prefill: {
          name: userInfo.name + "\u200B", // cache busting
          email: userInfo.email,
          contact: `${userInfo.phone}${Math.floor(Math.random() * 10)}`, // add random digit
        },
        notes: {
          bookingId,
          time: new Date().toISOString(),
        },
      
      
      // notes: {
      //   bookingId,
      //   time: new Date().toISOString(), // anything unique to bust internal caching
      // },
      theme: {
        color: "#3b82f6",
      },
    };

    setTimeout(() => {
      const razor = new window.Razorpay(options);
      razor.open();
      setIsLoading(false);
    }, 300);
  };


  useEffect(() => {
    const shouldShowModal = localStorage.getItem("showReviewModal") === "true";
    const shouldShowJobSummary = localStorage.getItem("showJobSummaryModal") === "true";

    const storedBookingId = localStorage.getItem("bookingIdForReview");
  
    if (shouldShowModal && storedBookingId && shouldShowJobSummary) {
      setBookingId(storedBookingId); // restore booking ID
      setShowJobSummary(false);
      setShowModal(true);
  
      // Clean up so it doesn't reopen every time
      localStorage.removeItem("showReviewModal");
      localStorage.removeItem("showJobSummaryModal");

      localStorage.removeItem("bookingIdForReview");
    }
  }, []);
  

  // rendercomponent logic

  let renderComponent = null;

  if (booking.bookingStatus === "confirmed") {
    switch (booking.workStatus) {
      case "not-started":
        renderComponent = (
          <BeforeStartComponent
            otpCode={booking.endOtp}
            helperPhone={booking.helperPhone}
            onChatClick={handleChatClick}
          />
        );
        break;

      case "completed":
        renderComponent = (
          <JobSummaryModal
            booking={booking}
            onPay={handlePayment} // Razorpay logic goes here
            onClose={() => setShowJobSummary(false)}
          />
        );
        break;

      default:
        renderComponent = <p>Waiting for update...</p>;
    }
  }

  useEffect(() => {
    // Safely get and parse localStorage data
    try {
      const userLocationStr = localStorage.getItem("userLocation");
      if (userLocationStr) {
        const parsedData = JSON.parse(userLocationStr);
        setUserData(parsedData);
        setLocation(parsedData.name || "");
      }

      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, [session]);

  // Fetch helper information
  useEffect(() => {
    const fetchHelperInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/helpers/${helperId}`);
        const data = await res.json();
        console.log("data of helperInfo", data);
        setHelperInfo(data);
      } catch (error) {
        console.log("error is coming");
        console.error("Error fetching helper", error);
        toast.error("Couldn't load helper details");
      } finally {
        setLoading(false);
      }
    };

    if (helperId) {
      fetchHelperInfo();
    }
  }, [helperId]);

  const handleBook = async () => {
    if (!issue || !issueType) {
      toast.error("Please describe your issue and select an issue type.");
      return;
    }

    try {
      setLoading(true);
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
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Booking failed");
        return;
      }
      console.log(data, " booking data");
      console.log(data.bookingId);

      setBookingId(data.bookingId);
      setOtpStep(true);
      setProgress(75);
      toast.success("OTP sent! Check your messages.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const helpersStr = localStorage.getItem("helpersDetails");
      console.log(helpersStr, "helpersStrr");
      if (helpersStr) {
        const parsedHelpers = JSON.parse(helpersStr);
        console.log(parsedHelpers, "parsedHelpers");
        setHelpersDetails(parsedHelpers);
      }
    } catch (error) {
      console.error("Error parsing helpers data:", error);
    }
  }, []);

  const sendNotification = async () => {
    try {
      const res = await axios.post(
        "/api/notifications/send",
        { bookingId }, // ✅ Payload as expected by the backend
        {
          headers: {
            "Content-Type": "application/json", // ✅ Correct header name
          },
        }
      );

      console.log("Notification sent:", res.data); // optional success log
    } catch (error) {
      console.error("Error sending the notification:", error.message);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/book-helper/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, otp }),
      });

      const data = await res.json();
      console.log(data, " data after verification");

      setBooking(data.bookingData);
      sendNotification();

      if (res.ok) {
        toast.success("Booking confirmed!");
        localStorage.removeItem("userLocation");
        setProgress(100);

        // Show success for 2 seconds then redirect
        setTimeout(() => {
          console.log("timeout called");
          // router.push("/bookings")
        }, 2000);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Get service icon based on helper type or issue type
  const getServiceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "mechanic":
        return <Tool className="h-5 w-5" />;
      case "fuel":
        return <Fuel className="h-5 w-5" />;
      case "tow":
        return <Truck className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Road Assistance</h1>
        <div className="flex items-center mb-4">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="ml-2 text-sm text-muted-foreground">
            {progress}%
          </span>
        </div>
        <p className="text-muted-foreground">
          {otpStep
            ? "Verify your booking"
            : "Book a roadside assistance professional"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Booking form or OTP verification */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {!otpStep ? "Request Assistance" : "Verify Your Booking"}
              </CardTitle>
              <CardDescription>
                {!otpStep
                  ? "Tell us about your vehicle issue"
                  : "Enter the 4-digit code sent to your phone"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!otpStep ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="issue-type"
                      className="block text-sm font-medium mb-1"
                    >
                      Issue Type
                    </label>
                    <Select value={issueType} onValueChange={setIssueType}>
                      <SelectTrigger id="issue-type">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat_tire">Flat Tire</SelectItem>
                        <SelectItem value="battery">Dead Battery</SelectItem>
                        <SelectItem value="fuel">Out of Fuel</SelectItem>
                        <SelectItem value="tow">Need a Tow</SelectItem>
                        <SelectItem value="lockout">Locked Out</SelectItem>
                        <SelectItem value="mechanical">
                          Mechanical Issue
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="issue-description"
                      className="block text-sm font-medium mb-1"
                    >
                      Issue Description
                    </label>
                    <Textarea
                      id="issue-description"
                      placeholder="Please describe your issue in detail"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Location
                    </label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Confirm your location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={userData?.name}
                      />
                    </div>
                    {userData?.name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Location detected automatically
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We've sent a 4-digit code to your registered phone number
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium mb-1"
                    >
                      Enter OTP
                    </label>
                    <Input
                      id="otp"
                      placeholder="4-digit code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
                        )
                      }
                      maxLength={4}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!otpStep ? (
                <Button
                  className="w-full cursor-pointer"
                  onClick={handleBook}
                  disabled={loading || !issue || !issueType}
                >
                  {loading ? "Processing..." : "Request Assistance"}
                </Button>
              ) : (
                <Button
                  className="w-full cursor-pointer"
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 4}
                  variant="default"
                >
                  {loading ? "Verifying..." : "Confirm Booking"}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Emergency contacts card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-sm font-medium">Emergency: 911</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">
                    Customer Support: 1-800-ROAD-HELP
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Helper details and map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Helper details card */}
          {helperInfo && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Helper Details</CardTitle>
                    <CardDescription>
                      Professional road assistance
                    </CardDescription>
                  </div>
                  <Badge
                    variant={helperInfo.isAvailable ? "success" : "secondary"}
                  >
                    {helperInfo.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="details"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 border">
                        <AvatarImage
                          src={
                            helperInfo.profileImage ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={helperInfo.name}
                        />
                        <AvatarFallback>
                          {helperInfo.name?.charAt(0) || "H"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">
                          {helperInfo.name}
                        </h3>

                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">
                            {helperInfo.ratings || "4.8"}
                          </span>
                          <span className="text-muted-foreground text-sm ml-1">
                            ({helperInfo.completedJobs?.length || "24"} jobs
                            completed)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {getServiceIcon(
                                helperInfo.serviceType || "mechanic"
                              )}
                            </Badge>
                            <span className="text-sm capitalize">
                              {helperInfo.serviceType || "Mechanic"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                              {helperInfo.city || "Downtown"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                              Response time: ~
                              {Math.floor(Math.random() * 15) + 5} min
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                              {helperInfo.phone || "Contact via app"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Service Status</h4>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                helperInfo.availability
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {helperInfo.availability
                                ? "Available Now"
                                : "Busy"}
                            </Badge>

                            <div className="flex items-center">
                              <span className="text-sm mr-2">
                                Total Earnings:
                              </span>
                              <Badge variant="outline">
                                $
                                {helperInfo.totalEarnings?.toLocaleString() ||
                                  "2,450"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border">
                          <CardHeader className="py-3 pb-1">
                            <CardTitle className="text-base text-center">
                              Completed Jobs
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 text-center">
                            <p className="text-3xl font-bold text-primary">
                              {helperInfo.completedJobs?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total services provided
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border">
                          <CardHeader className="py-3 pb-1">
                            <CardTitle className="text-base text-center">
                              Rating
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 text-center">
                            <div className="flex items-center justify-center">
                              <p className="text-3xl font-bold text-primary mr-1">
                                {helperInfo.ratings?.toFixed(1) || "5.0"}
                              </p>
                              <Star
                                className="h-5 w-5 text-yellow-500"
                                fill="currentColor"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Customer satisfaction
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border">
                          <CardHeader className="py-3 pb-1">
                            <CardTitle className="text-base text-center">
                              Experience
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 text-center">
                            <p className="text-3xl font-bold text-primary">
                              {helperInfo.completedJobs?.length > 50
                                ? "Expert"
                                : helperInfo.completedJobs?.length > 20
                                ? "Pro"
                                : "Regular"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Service level
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Service History
                        </h3>
                        <div className="space-y-2">
                          {helperInfo.completedJobs &&
                          helperInfo.completedJobs.length > 0 ? (
                            helperInfo.completedJobs
                              .slice(0, 3)
                              .map((job, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between border rounded-md p-3"
                                >
                                  <div className="flex items-center">
                                    {job.serviceType === "mechanic" && (
                                      <Tool className="h-4 w-4 mr-2 text-primary" />
                                    )}
                                    {job.serviceType === "fuel" && (
                                      <Fuel className="h-4 w-4 mr-2 text-primary" />
                                    )}
                                    {job.serviceType === "tow" && (
                                      <Truck className="h-4 w-4 mr-2 text-primary" />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium capitalize">
                                        {job.serviceType} Service
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          job.completionTime
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      job.status === "completed"
                                        ? "success"
                                        : "destructive"
                                    }
                                  >
                                    {job.status}
                                  </Badge>
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-4 border rounded-md">
                              <p className="text-sm text-muted-foreground">
                                No service history available
                              </p>
                            </div>
                          )}
                        </div>

                        {helperInfo.completedJobs &&
                          helperInfo.completedJobs.length > 3 && (
                            <Button
                              variant="ghost"
                              className="w-full text-sm mt-2"
                              size="sm"
                            >
                              View all {helperInfo.completedJobs.length}{" "}
                              services
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Service Breakdown
                        </h3>
                        <div className="space-y-2">
                          {["mechanic", "fuel", "tow"].map((type) => {
                            const count =
                              helperInfo.completedJobs?.filter(
                                (job) => job.serviceType === type
                              ).length || 0;
                            const percentage = helperInfo.completedJobs?.length
                              ? Math.round(
                                  (count / helperInfo.completedJobs.length) *
                                    100
                                )
                              : 0;

                            return (
                              <div key={type} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {type === "mechanic" && (
                                      <Tool className="h-4 w-4 mr-2" />
                                    )}
                                    {type === "fuel" && (
                                      <Fuel className="h-4 w-4 mr-2" />
                                    )}
                                    {type === "tow" && (
                                      <Truck className="h-4 w-4 mr-2" />
                                    )}
                                    <span className="text-sm capitalize">
                                      {type}
                                    </span>
                                  </div>
                                  <span className="text-sm">{count} jobs</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <div className="space-y-4">
                      {helperInfo.reviews && helperInfo.reviews.length > 0 ? (
                        helperInfo.reviews.slice(0, 3).map((review, index) => (
                          <div
                            key={index}
                            className="border-b pb-3 last:border-0"
                          >
                            <div className="flex items-center mb-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>
                                  {review.user?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {review.user || "Anonymous User"}
                                </p>
                                <div className="flex items-center">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < (review.rating || 5)
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                        }`}
                                        fill={
                                          i < (review.rating || 5)
                                            ? "currentColor"
                                            : "none"
                                        }
                                      />
                                    ))}
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {review.date || "2 weeks ago"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">
                              {review.text ||
                                "Great service, arrived quickly and fixed my issue!"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            No reviews yet
                          </p>
                        </div>
                      )}

                      {helperInfo.reviews && helperInfo.reviews.length > 3 && (
                        <Button
                          variant="ghost"
                          className="w-full text-sm"
                          size="sm"
                        >
                          View all {helperInfo.reviews.length} reviews
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="services">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Card className="border">
                        <CardHeader className="py-3">
                          <div className="flex items-center">
                            <div className="mr-3 bg-primary/10 p-2 rounded-full">
                              <Tool className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              Mechanical Repairs
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground">
                            Basic repairs to get your vehicle running again
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="py-3">
                          <div className="flex items-center">
                            <div className="mr-3 bg-primary/10 p-2 rounded-full">
                              <Fuel className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              Fuel Delivery
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground">
                            Emergency fuel when you're stranded
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="py-3">
                          <div className="flex items-center">
                            <div className="mr-3 bg-primary/10 p-2 rounded-full">
                              <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              Towing Service
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground">
                            Towing to nearest service center
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="py-3">
                          <div className="flex items-center">
                            <div className="mr-3 bg-primary/10 p-2 rounded-full">
                              <Car className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              Tire Change
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground">
                            Quick tire replacement or repair
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Map card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Your location and nearby helpers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-b-lg h-[300px]">
              {userData?.lat && userData?.lon ? (
                <MapComponent
                  userLat={userData.lat}
                  userLon={userData.lon}
                  helpers={helpersDetails || []}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Location data unavailable
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="p-4">
        {renderComponent || <p>No active booking...</p>}
        <ChatModalWrapper
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          bookingId={booking._id}
          currentUser="user" // or "helper"
        />
        {showJobSummary && (
          <JobSummaryModal
            booking={booking}
            onPay={handlePayment}
            onClose={() => setShowJobSummary(false)}
          />
        )}

        {showModal && (
          <RatingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            bookingId={bookingId}
          />
        )}
      </div>

      {/* Hidden component for location tracking */}
      {session?.user?.id && (
        <HelperLocationEmitter helperId={session.user.id} />
      )}
    </div>
  );
}
