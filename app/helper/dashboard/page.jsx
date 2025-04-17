"use client"
import { useState, useEffect } from "react"
import {
  Activity,
  User,
  Wallet,
  Star,
  Briefcase,
  PenToolIcon as Tool,
  Fuel,
  Truck,
  Bell,
  Home,
  Settings,
  LogOut,
  Calendar,
  MessageSquare,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Badge } from "components/ui/badge"
import { Progress } from "components/ui/progress"
import { Separator } from "components/ui/separator"
import { toast } from "sonner";
import { useSession } from "next-auth/react"
import NotificationsPanel from "components/NotificationsPage"
import { useAppContext } from "app/context/Appcontext"
export default function HelperDashboard() {

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [availability, setAvailability] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)
  // const { data: session , status } = useSession();
  const {session} = useAppContext();

  const {helperId} = useAppContext();
  console.log(helperId)
  console.log(session)
  // const helperEmail = session.session.user.email;
  // console.log(helperEmail , "helperEmail");


  // Assume user ID is in localStorage (or you can use NextAuth session)
  // const helperId = typeof window !== "undefined" ? localStorage.getItem("selectedHelperId") : null
// if(status ==="loading"){

//   console.log("sessiion status is loading")
// }

// if(!session){
//   console.log("session is not there")
// }
// if(session){
//   console.log(session , "session")
// }

// if(session.user)
// {
//   console.log(session.user , " session user");
// }
  useEffect(()=>{
    console.log(session,"session");

  },[]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/helper/${helperId}/dashboard`)
        const data = await res.json()
        console.log(data , " stats")
        setStats(data)
        setAvailability(data?.basicInfo?.availability ?? true)
      } catch (err) {
        console.error("Error fetching dashboard data", err)
        toast({
          variant: "destructive",
          title: "Error fetching dashboard data",
          description: "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    if (helperId) fetchData()
  }, [helperId, toast])

  const toggleAvailability = async () => {
    try {
      const res = await fetch(`/api/helper/${helperId}/toggle-availability`, {
        method: "PUT",
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to toggle availability");
      }
  
      const data = await res.json();
  
      setAvailability(data.availability);
      toast({
        title: `You are now ${data.availability ? "Online" : "Offline"}`,
        description: data.availability
          ? "You can now receive new job requests"
          : "You won't receive new job requests",
        variant: data.availability ? "default" : "destructive",
      });
    } catch (err) {
      console.error("Failed to toggle availability:", err.message);
      toast({
        variant: "destructive",
        title: "Failed to update availability",
        description: err.message || "Please try again later.",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-md ml-3 animate-pulse"></div>
            </div>
            <div className="px-4 mt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-full bg-gray-200 rounded-md mb-2 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex h-16 bg-white border-b">
            <div className="flex justify-between items-center w-full px-4">
              <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          <main className="flex-1 p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg shadow animate-pulse"></div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-white rounded-lg shadow animate-pulse"></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Dashboard</CardTitle>
            <CardDescription>We couldn't load your dashboard data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check your connection and try again. If the problem persists, contact support.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { basicInfo, totalEarnings, averageRating, highestRating, totalJobs, jobBreakdown, latestReviews } = stats
    
  // Calculate percentages for job breakdown
  const totalJobsCount = jobBreakdown.mechanic + jobBreakdown.fuel + jobBreakdown.tow
  const mechanicPercent = totalJobsCount > 0 ? Math.round((jobBreakdown.mechanic / totalJobsCount) * 100) : 0
  const fuelPercent = totalJobsCount > 0 ? Math.round((jobBreakdown.fuel / totalJobsCount) * 100) : 0
  const towPercent = totalJobsCount > 0 ? Math.round((jobBreakdown.tow / totalJobsCount) * 100) : 0

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />,
      )
    }
    return stars
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Tool className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-semibold">RoadAssist</span>
          </div>
          <div className="mt-6 flex flex-col flex-1">
            <nav className="flex-1 px-4 space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("overview")}>
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("jobs")}>
                <Briefcase className="mr-3 h-5 w-5" />
                Jobs
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("earnings")}>
                <Wallet className="mr-3 h-5 w-5" />
                Earnings
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("reviews")}>
                <MessageSquare className="mr-3 h-5 w-5" />
                Reviews
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("calendar")}>
                <Calendar className="mr-3 h-5 w-5" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("settings")}>
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("help")}>
                <HelpCircle className="mr-3 h-5 w-5" />
                Help & Support
              </Button>
            </nav>
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b">
          <div className="flex justify-between items-center w-full px-4 md:px-6">
            <h1 className="text-xl font-semibold text-gray-800">Helper Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 z-50">
                    <NotificationsPanel helperId={helperId} onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Availability Status */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${availability ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm font-medium">{availability ? "Online" : "Offline"}</span>
            </div>
            <Button
              onClick={toggleAvailability}
              variant={availability ? "default" : "outline"}
              className={
                availability ? "bg-green-500 hover:bg-green-600" : "text-red-500 border-red-500 hover:bg-red-50"
              }
            >
              {availability ? "Go Offline" : "Go Online"}
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <h3 className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</h3>
              </CardContent>
            </Card>

            <Card>
  <CardContent className="p-6 flex flex-col items-center justify-center">
    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
      <Star className="h-6 w-6 text-blue-600" />
    </div>
    <p className="text-sm font-medium text-gray-500">Average Rating</p>
    <h3 className="text-2xl font-bold">
      {typeof averageRating === "number" && !isNaN(averageRating)
        ? averageRating.toFixed(1)
        : "N/A"}
    </h3>
    <div className="flex mt-1">
      {typeof averageRating === "number" && !isNaN(averageRating)
        ? renderStars(averageRating)
        : null}
    </div>
  </CardContent>
</Card>


            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                <h3 className="text-2xl font-bold">{totalJobs}</h3>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <h3 className="text-2xl font-bold">98%</h3>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your basic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={basicInfo.avatar || "/placeholder-user.jpg"} alt={basicInfo.name} />
                    <AvatarFallback className="text-lg">{basicInfo.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{basicInfo.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {basicInfo.serviceType}
                    </Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500 w-20">Email:</span>
                    <span className="text-sm font-medium">{basicInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500 w-20">Phone:</span>
                    <span className="text-sm font-medium">{basicInfo.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500 w-20">Service:</span>
                    <span className="text-sm font-medium">{basicInfo.serviceType}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            {/* Job Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Job Breakdown</CardTitle>
                <CardDescription>Distribution of your service types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Tool className="h-4 w-4 mr-2 text-purple-600" />
                        <span className="text-sm font-medium">Mechanic</span>
                      </div>
                      <span className="text-sm font-medium">
                        {jobBreakdown.mechanic} jobs ({mechanicPercent}%)
                      </span>
                    </div>
                    <Progress
                      value={mechanicPercent}
                      className="h-2 bg-purple-100"
                      indicatorClassName="bg-purple-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm font-medium">Fuel</span>
                      </div>
                      <span className="text-sm font-medium">
                        {jobBreakdown.fuel} jobs ({fuelPercent}%)
                      </span>
                    </div>
                    <Progress value={fuelPercent} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium">Tow</span>
                      </div>
                      <span className="text-sm font-medium">
                        {jobBreakdown.tow} jobs ({towPercent}%)
                      </span>
                    </div>
                    <Progress value={towPercent} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>

            {/* Latest Reviews */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Latest Reviews</CardTitle>
                <CardDescription>What your customers are saying</CardDescription>
              </CardHeader>
              <CardContent>
                {latestReviews?.length > 0 ? (
                  <div className="space-y-4">
                    {latestReviews.map((review, index) => (
                      <div key={index} className="p-4 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{review.userName?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <p className="text-sm font-medium">{review.userName || "Anonymous User"}</p>
                              <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No reviews yet.</p>
                    <p className="text-sm text-gray-400">Complete more jobs to get customer reviews.</p>
                  </div>
                )}
              </CardContent>
              {latestReviews?.length > 0 && (
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Reviews
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
