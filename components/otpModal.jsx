"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { CheckCircle, AlertTriangle } from "lucide-react"

export default function OtpVerificationModal({ isOpen, onClose, bookingId, onVerified }) {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(null) // null, true, false

  const handleVerifyOtp = async () => {
    setIsVerifying(true)
    try {
      const res = await fetch("/api/bookings/verify-endotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, otp }),
      })

      const data = await res.json()

      if (res.ok) {
        setVerificationSuccess(true)
        setTimeout(() => {
          setIsVerifying(false)
          onClose()
          onVerified()
        }, 1500)
      } else {
        setVerificationSuccess(false)
        setIsVerifying(false)
      }
    } catch (error) {
      console.error("OTP Verification Error:", error)
      setVerificationSuccess(false)
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OTP Verification</DialogTitle>
          <DialogDescription>Enter the OTP sent to the customer to complete the booking.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="otp" className="text-right">
              OTP
            </label>
            <Input type="number" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="col-span-3" />
          </div>
          {verificationSuccess === false && (
            <div className="flex items-center text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Invalid OTP. Please try again.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleVerifyOtp} disabled={isVerifying}>
            {isVerifying ? (
              <>
                Verifying...
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : verificationSuccess === true ? (
              <>
                Verified! <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
