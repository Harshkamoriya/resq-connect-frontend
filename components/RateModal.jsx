"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, Car, MessageSquare, X, Send } from "lucide-react"

export default function RatingModal({ isOpen, onClose, bookingId }) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  console.log(bookingId,"booking id in the ratemodal")

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false)
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const res = await fetch("/api/booking/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, review }),
      })

      const data = await res.json()
      console.log(data , "data")

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        alert(data.message || "Error submitting rating")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong!")
      setIsSubmitting(false)
    }
  }

  const taglines = [
    "Your feedback helps us stay on the road to excellence!",
    "Help us steer our service in the right direction.",
    "Your insights fuel our journey to better service.",
    "Every review helps us navigate toward improvement.",
  ]

  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header with car icon */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl p-6 text-white">
              <div className="flex items-center mb-2">
                <div className="bg-white p-2 rounded-full mr-3">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Rate Your Rescue Experience</h2>
              </div>
              <p className="text-blue-100 text-sm">{randomTagline}</p>
            </div>

            <div className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="bg-green-100 p-3 rounded-full mb-4"
                  >
                    <ThumbsUp className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600 text-center">
                    Your feedback helps us improve our roadside rescue services.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Star Rating */}
                  <div className="mb-6">
                    <label className="block font-medium text-gray-700 mb-2">How would you rate your rescue?</label>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            } transition-colors`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Great"}
                      {rating === 5 && "Excellent"}
                    </div>
                  </div>

                  {/* Review Text Area */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                      <label className="font-medium text-gray-700">Share your experience</label>
                    </div>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Tell us about your roadside rescue experience..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      rows={4}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${
                        isSubmitting ? "opacity-70" : "hover:bg-blue-700"
                      } transition-colors`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
