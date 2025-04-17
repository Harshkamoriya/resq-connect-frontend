"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import {
  Wrench,
  Fuel,
  Truck,
  MapPin,
  Phone,
  DollarSign,
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
  Star,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

const HelperForm = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    phone: "",
    serviceType: "",
    price: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)
  const [locationStatus, setLocationStatus] = useState("idle") // idle, loading, success, error

  const serviceOptions = [
    {
      value: "mechanic",
      label: "Mechanic",
      icon: <Wrench className="h-5 w-5" />,
      description: "Vehicle repair services for breakdowns",
    },
    {
      value: "fuel",
      label: "Fuel Delivery",
      icon: <Fuel className="h-5 w-5" />,
      description: "Emergency fuel delivery when you run out",
    },
    {
      value: "tow",
      label: "Tow Truck",
      icon: <Truck className="h-5 w-5" />,
      description: "Towing services for vehicle transport",
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      setLocationStatus("loading")

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus("success")
          resolve([position.coords.longitude, position.coords.latitude])
        },
        (error) => {
          setLocationStatus("error")
          reject(new Error(error.message))
        },
        { timeout: 10000 },
      )
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    try {
      const coordinates = await getLocation()

      await axios.post("/api/apply-helper", {
        ...formData,
        price: Number.parseFloat(formData.price),
        coordinates,
      })

      setFormSuccess(true)

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/helper/dashboard")
      }, 2000)
    } catch (error) {
      console.log(error.message)
      setFormError(error?.response?.data?.message || "Failed to apply as helper. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-center text-xl font-medium mb-4">Please sign in to register</p>
        <p className="text-center text-gray-600 mb-6">
          You need to be signed in to register as a helper on ResQ-Connect.
        </p>
        <Button className="w-full" onClick={() => router.push("/api/auth/signin")}>
          Sign In to Continue
        </Button>
      </div>
    )
  }

  if (formSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your helper application has been successfully submitted. You'll be redirected to your dashboard shortly.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => router.push("/helper/dashboard")}>
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-2xl font-bold text-blue-700 mb-3">Join Our Rescue Network</h1>
            <p className="text-gray-600 mb-6">
              Become a ResQ-Connect helper and earn by providing roadside assistance to those in need.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Earn Money</h3>
                  <p className="text-sm text-gray-600">Set your own rates and receive payments directly.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Work Locally</h3>
                  <p className="text-sm text-gray-600">Help people in your area when they need it most.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Build Reputation</h3>
                  <p className="text-sm text-gray-600">Earn reviews and become a trusted helper.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="font-medium">Helper Success Story</h3>
                </div>
                <p className="text-sm italic text-gray-700">
                  "I've been a ResQ-Connect helper for 6 months and have helped over 50 stranded motorists. The flexible
                  schedule and extra income have been fantastic!"
                </p>
                <p className="text-sm font-medium mt-2">- Michael R., Mechanic</p>
              </div>
            </div>
          </motion.div>
        </div>

        <Card className="md:col-span-3">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardTitle>Helper Registration</CardTitle>
            <CardDescription className="text-blue-100">
              Fill out the form below to start helping others on the road
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">We'll use this to contact you about service requests</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleSelectChange("serviceType", value)}
                  required
                >
                  <SelectTrigger id="serviceType" className="w-full">
                    <SelectValue placeholder="Select a service you provide" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        <div className="flex items-center">
                          <span className="mr-2 text-blue-600">{service.icon}</span>
                          <span>{service.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {formData.serviceType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-3 bg-blue-50 rounded-md"
                  >
                    <div className="flex items-center">
                      {serviceOptions.find((s) => s.value === formData.serviceType)?.icon}
                      <span className="ml-2 font-medium">
                        {serviceOptions.find((s) => s.value === formData.serviceType)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {serviceOptions.find((s) => s.value === formData.serviceType)?.description}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Service Price (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Enter your service price"
                    min="0"
                    step="10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Set a competitive price for your services</p>
              </div>

              <div className="pt-2">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">Location Access</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-md border text-sm">
                  <p className="text-gray-700 mb-2">
                    We need your location to match you with nearby customers in need of assistance.
                  </p>

                  <div className="flex items-center">
                    {locationStatus === "idle" && (
                      <div className="text-amber-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Location will be requested on submission</span>
                      </div>
                    )}

                    {locationStatus === "loading" && (
                      <div className="text-blue-600 flex items-center">
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        <span>Getting your location...</span>
                      </div>
                    )}

                    {locationStatus === "success" && (
                      <div className="text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Location access granted</span>
                      </div>
                    )}

                    {locationStatus === "error" && (
                      <div className="text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Location access denied</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t">
            <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  )
}

export default HelperForm
