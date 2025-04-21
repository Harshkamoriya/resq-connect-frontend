"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Search, Loader2, Car } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import ETAComponent from "components/Eta"
import { useAppContext } from "app/context/Appcontext"
import axios from "axios"
import { useSession } from "next-auth/react"
const services = [
  { id: 1, name: "Mechanic", icon: "🔧" },
  { id: 2, name: "Fuel Delivery", icon: "⛽" },
  { id: 3, name: "Towing Service", icon: "🚚" },
  { id: 4, name: "Battery Jump Start", icon: "🔋" },
  { id: 5, name: "Flat Tire Assistance", icon: "🛞" },
  { id: 6, name: "Lockout Service", icon: "🔑" },
  { id: 7, name: "Winch Service", icon: "🪝" },
]

export default function SelectForm() {
  const [serviceType, setServiceType] = useState("")
  const [location, setLocation] = useState("")
  const [helpersData, setHelpersData] = useState([])
  const [loading, setLoading] = useState(false)
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)
  const {helpersDetails  , setHelpersDetails} = useAppContext();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      service: "",
    },
  })
const {data : session} = useSession();
console.log(session)
  const { userLocation, setUserLocation}= useAppContext();
  useEffect(() => {
    console.log("Updated helpersData:", helpersData)
  }, [helpersData])

  const fetchLocations = async (query) => {
    if (!query) return
    try {
      setLocationLoading(true)
      const response = await fetch(`api/location?query=${query}`)
      const data = await response.json()
      setSuggestions(data)
      setLocationLoading(false)
    } catch (error) {
      console.error("Error fetching locations:", error)
      setLocationLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setLocationInput(value)
    if (value.length > 2) {
      fetchLocations(value)
    } else {
      setSuggestions([])
    }
  }

  useEffect(() => {
    const postUserLocation = async () => {
      try {
        console.log(userLocation, "userLocation")
        const res = await axios.put(`/api/set/user-location`, {
          location: userLocation,
          email: session.user.email,
        });
        console.log(res, "response after updating user location");
      } catch (error) {
        console.log("error updating user location", error.message);
      }
    };
  
    postUserLocation();
    localStorage.setItem("userLocation", JSON.stringify(userLocation));
  }, [userLocation]);
  

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLatitude(latitude)
        setLongitude(longitude)
        
        await reverseGeocode(latitude, longitude)
      },
      (error) => {
        toast.error("Error getting location: " + error.message)
        setLocationLoading(false)
      },
    )
  }

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`)
      const data = await response.json()
      setLocation(data.address)
      console.log(data.address)

      setUserLocation({
      name:data.address,
      lat,
      lon,

      });

      console.log(userLocation,"userLocation");
      setLocationInput(data.address)
      form.setValue("location", data.address)
      setLocationLoading(false)
    } catch (error) {
      console.error("Error fetching address:", error)
      toast.error("Error fetching address")
      setLocationLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (!data.service) {
        toast.error("Please select a service type")
        setLoading(false)
        return
      }

      if (!latitude || !longitude) {
        toast.error("Please select a valid location")
        setLoading(false)
        return
      }

      console.log("Latitude:", latitude, "Longitude:", longitude)

      const url = `/api/nearby-helpers?lat=${latitude}&lon=${longitude}&serviceType=${encodeURIComponent(data.service)}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.message)
      } else {
        toast.success("Helpers found nearby!")
        setHelpersData(result.helpers)
        console.log(result.helpers)
        // setHelpersDetails( result.helpers);
        localStorage.setItem("helpersDetails", JSON.stringify(result.helpers));
        
      }

      setLoading(false)
    } catch (error) {
      // console.error("Fetch error:", error)
      toast.error("Error fetching helpers")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Roadside Assistance</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get immediate help for your vehicle issues. We'll connect you with nearby service providers.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/3"
          >
            <Card className="shadow-lg border-t-4 border-t-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  Find Help Nearby
                </CardTitle>
                <CardDescription>Enter your location and select the service you need</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Location Field */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium">Your Location</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Enter your location"
                                  value={locationInput}
                                  onChange={handleInputChange}
                                  className="pl-9"
                                />
                              </div>
                            </FormControl>
                            {locationLoading && (
                              <div className="absolute right-3 top-2.5">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              </div>
                            )}
                          </div>

                          {suggestions.length > 0 && (
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white border rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg z-10 absolute w-full"
                            >
                              {suggestions.map((place, index) => (
                                <motion.li
                                  key={index}
                                  whileHover={{ backgroundColor: "#f3f4f6" }}
                                  className="p-2 text-sm border-b last:border-b-0 cursor-pointer flex items-center"
                                  onClick={() => {
                                    setLocationInput(place.display_name)
                                    setSuggestions([])
                                    form.setValue("location", place.display_name)
                                    setLatitude(place.lat)
                                    setLongitude(place.lon)
                                  }}
                                >
                                  <MapPin className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
                                  <span className="line-clamp-2">{place.display_name}</span>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={getGPSLocation}
                        disabled={locationLoading}
                      >
                        {locationLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        {locationLoading ? "Getting Location..." : "Use My Current Location"}
                      </Button>
                    </motion.div>

                    {/* Service Selection */}
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium">Service Needed</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setServiceType(value)
                            }}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.name}>
                                  <div className="flex items-center gap-2">
                                    <span>{service.icon}</span>
                                    <span>{service.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2">
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        {loading ? "Searching..." : "Find Helpers"}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
                        
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-2/3"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Searching for nearby helpers...</p>
              </div>
            ) : (
              <ETAComponent userLat={latitude} userLon={longitude} helpers={helpersData} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

