"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, Car, ArrowRight } from "lucide-react"
import { Card,CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import dynamic from "next/dynamic"
import { useAppContext } from "app/context/Appcontext"
export default function ETAComponent({ userLat, userLon, helpers }) {
  const [etaList, setEtaList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false })
const {setSelectedHelperId } = useAppContext();
const router = useRouter();



  useEffect(() => {
    async function fetchETAs() {
      if (!helpers.length) {
        setIsLoading(false)
        return
      }
        console.log("helpers", helpers)
      setIsLoading(true)
      const fetchedETAs = await Promise.all(
        helpers.map(async (helper) => {
          const [helperLon, helperLat] = helper.location.coordinates

          try {
            const response = await fetch(
              `/api/getETA?userLat=${userLat}&userLon=${userLon}&helperLat=${helperLat}&helperLon=${helperLon}`,
            )

            const data = await response.json()

            return {
              ...helper,
              distance: data.distanceInKm,
              eta: data.etaFormatted,
              duration: data.durationInSeconds,
            }
          } catch (error) {
            console.error("Error fetching ETA for helper", helper.name, error)
            return {
              ...helper,
              distance: null,
              eta: null,
              duration: Number.POSITIVE_INFINITY, // Use Infinity for sorting purposes
            }
          }
        }),
      )

      // Sort by duration (closest first)
      const sortedETAs = [...fetchedETAs].sort((a, b) => a.duration - b.duration)
      setEtaList(sortedETAs)
      setIsLoading(false)
    }

    fetchETAs()
  }, [userLat, userLon, helpers])

  // Helper function to get a color based on ETA time
  const getEtaColor = (duration) => {
    if (!duration) return "bg-gray-500"
    if (duration < 600) return "bg-green-500" // Less than 10 minutes
    if (duration < 1200) return "bg-yellow-500" // Less than 20 minutes
    return "bg-orange-500" // More than 20 minutes
  }

  // Helper function to get service icon
  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "Mechanic":
        return "🔧"
      case "Fuel Delivery":
        return "⛽"
      case "Towing Service":
        return "🚚"
      case "Battery Jump Start":
        return "🔋"
      case "Flat Tire Assistance":
        return "🛞"
      case "Lockout Service":
        return "🔑"
      case "Winch Service":
        return "🪝"
      default:
        return "🚗"
    }
  }

  // handle click function to route to the new booking form page 
  const handleClick = (helperId)=>{
       setSelectedHelperId(helperId);
       localStorage.setItem("selectedHelperId", helperId);
       router.push(`/book/${helperId}`);
  }
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
                        <MapComponent userLat={userLat} userLon={userLon} helpers={helpers} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Nearby Helpers</h2>
        <p className="text-gray-600 text-center">
          {etaList.length > 0
            ? "Help is on the way! Here are the closest service providers."
            : "We'll find the closest help for you."}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-20 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : etaList.length > 0 ? (
        <AnimatePresence>
          <div className="space-y-4">
            {etaList.map((helper, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="w-full"
              >

                <Card
                  className="overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300"
                  style={{ borderLeftColor: getEtaColor(helper.duration).replace("bg-", "#").replace("500", "500") }}
                >
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                            {getServiceIcon(helper.serviceType)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{helper.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {helper.serviceType}
                            </Badge>

                            {helper.distance && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {helper.distance} km
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-0 flex items-center gap-2">
                          {helper.eta ? (
                            <div className="flex flex-col items-center">
                              <div className="text-sm text-gray-500">ETA</div>
                              <div className="font-bold text-lg flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                {helper.eta} min
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline">ETA Unavailable</Badge>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleClick(helper._id)}
                            
                            
                            className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </motion.div>
              
            ))}

          </div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No helpers found. Please try a different service or location.</p>
        </motion.div>
      )}
    </div>
  )
}

