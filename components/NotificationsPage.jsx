"use client"
import { useState, useEffect } from "react"
import { Bell, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { toast } from "sonner";
import { useRouter } from 'next/navigation';



const NotificationsPanel = ({ helperId, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/notifications/${helperId}`)
        const data = await res.json()
        if (data.success) setNotifications(data.notifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    if (helperId) {
      fetchNotifications()
    }
  }, [helperId])

  const handleAction = async (bookingId, action) => {
    try {
      const res = await fetch("/api/notifications/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, bookingId, action }),
      })
      const data = await res.json()

      if (data.success) {
        setNotifications((prev) => prev.map((n) => (n.bookingId._id === bookingId ? { ...n, status: action } : n)))

        toast({
          title: data.message,
          variant: action === "accept" ? "default" : "destructive",
        })
      }
    } catch (error) {
      console.error("Error handling notification action:", error)
      toast({
        title: "Action failed",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "accept":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "reject":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "accept":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "reject":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Notifications</CardTitle>
          <CardDescription>Your recent job requests</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XCircle className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-md animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3 py-1">
            {notifications.map((note) => (
              <div key={note.bookingId._id} className="p-3 rounded-lg bg-gray-50 transition-all hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/helper/requests/${note.bookingId._id}`)}              >
                <div className="flex items-start justify-between cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 cursor-pointer">{getStatusIcon(note.status)}</div>
                    <div>
                      <p className="font-medium text-sm">{note.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>{getStatusBadge(note.status)}</div>
                </div>

                {note.status === "pending" && (
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white w-full"
                      onClick={() => handleAction(note.bookingId._id, "accept")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 w-full"
                      onClick={() => handleAction(note.bookingId._id, "reject")}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No notifications</p>
            <p className="text-sm text-gray-400">You're all caught up!</p>
          </div>
        )}
      </CardContent>
      {notifications.length > 0 && (
        <CardFooter className="border-t pt-3">
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Notifications
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default NotificationsPanel
