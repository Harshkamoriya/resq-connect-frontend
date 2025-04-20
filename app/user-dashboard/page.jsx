"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Car,
  Clock,
  CreditCard,
  Fuel,
  GanttChart,
  HelpCircle,
  History,
  Home,
  LifeBuoy,
  LogOut,
  MapPin,
  Phone,
  Settings,
  Star,
  Truck,
  UserIcon,
  Wrench,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Badge } from "components/ui/badge"
import { Button } from "components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "components/ui/navigation-menu"
import { Progress } from "components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"

// Mock data based on the model
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  role: "customer",
  profileImage: "/placeholder.svg?height=100&width=100",
  location: {
    name: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  totalMoneySpent: 1250,
  servicesBooked: [
    {
      serviceType: "mechanic",
      helper: {
        _id: "helper1",
        name: "Mike's Auto Repair",
        phone: "+1 (555) 987-6543",
      },
      bookingId: {
        _id: "booking1",
      },
      status: "completed",
      estimatedPrice: 150,
      finalPrice: 175,
      distance: 3.2,
      requestTime: new Date("2023-11-15T14:30:00"),
      completionTime: new Date("2023-11-15T16:45:00"),
    },
    {
      serviceType: "tow",
      helper: {
        _id: "helper2",
        name: "Quick Tow Services",
        phone: "+1 (555) 456-7890",
      },
      bookingId: {
        _id: "booking2",
      },
      status: "completed",
      estimatedPrice: 200,
      finalPrice: 200,
      distance: 8.5,
      requestTime: new Date("2023-12-03T09:15:00"),
      completionTime: new Date("2023-12-03T10:30:00"),
    },
    {
      serviceType: "fuel",
      helper: {
        _id: "helper3",
        name: "Emergency Fuel Delivery",
        phone: "+1 (555) 234-5678",
      },
      bookingId: {
        _id: "booking3",
      },
      status: "pending",
      estimatedPrice: 75,
      finalPrice: null,
      distance: 2.1,
      requestTime: new Date(),
      completionTime: null,
    },
  ],
  ratingsGiven: [
    {
      helper: {
        _id: "helper1",
        name: "Mike's Auto Repair",
      },
      bookingId: {
        _id: "booking1",
      },
      rating: 4,
      review: "Great service, fixed my car quickly. A bit more expensive than quoted though.",
      createdAt: new Date("2023-11-15T17:00:00"),
    },
    {
      helper: {
        _id: "helper2",
        name: "Quick Tow Services",
      },
      bookingId: {
        _id: "booking2",
      },
      rating: 5,
      review: "Excellent service! Arrived quickly and was very professional.",
      createdAt: new Date("2023-12-03T11:00:00"),
    },
  ],
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const totalBookings = userData.servicesBooked.length
  const completedBookings = userData.servicesBooked.filter((service) => service.status === "completed").length
  const pendingBookings = userData.servicesBooked.filter((service) => service.status === "pending").length
  const averageRating =
    userData.ratingsGiven.reduce((acc, curr) => acc + curr.rating, 0) / userData.ratingsGiven.length || 0

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get service icon
  const getServiceIcon = (type) => {
    switch (type) {
      case "mechanic":
        return <Wrench className="h-4 w-4" />
      case "fuel":
        return <Fuel className="h-4 w-4" />
      case "tow":
        return <Truck className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <LifeBuoy className="h-6 w-6" />
            <span>RoadAssist</span>
          </div>

          <NavigationMenu className="mx-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <History className="mr-2 h-4 w-4" />
                  Bookings
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/dashboard/bookings"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">All Bookings</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            View and manage all your service bookings
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/dashboard/bookings/pending" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Pending</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Track your pending service requests
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/bookings/completed" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Completed</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View your completed service history
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/bookings/new" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Book New Service</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Request a new roadside assistance service
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Account
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    <li>
                      <Link href="/dashboard/profile" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Profile</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage your personal information
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/payments" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Payments</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View your payment history
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/ratings" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Ratings</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage your service ratings
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/help" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userData.name}</h1>
            <p className="text-muted-foreground">Here's an overview of your service bookings and account.</p>
          </div>
          <Button>Book New Service</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${userData.totalMoneySpent}</div>
              <p className="text-xs text-muted-foreground">Across {totalBookings} bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
              <GanttChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBookings}</div>
              <Progress value={(completedBookings / totalBookings) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5.0</div>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your most recent service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.servicesBooked.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                      <div
                        className={`rounded-full p-2 ${service.serviceType === "mechanic" ? "bg-blue-100" : service.serviceType === "fuel" ? "bg-green-100" : "bg-purple-100"}`}
                      >
                        {getServiceIcon(service.serviceType)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)} Service
                          </p>
                          <Badge
                            variant={
                              service.status === "completed"
                                ? "default"
                                : service.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Provider: {service.helper.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(service.requestTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${service.finalPrice || service.estimatedPrice}</p>
                        <p className="text-xs text-muted-foreground">{service.distance} km</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("bookings")}>
                  View All Bookings
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-medium">{userData.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{userData.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{userData.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{userData.location.name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("profile")}>
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Ratings</CardTitle>
                  <CardDescription>Ratings you've given to service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.ratingsGiven.slice(0, 2).map((rating, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{rating.helper.name}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < rating.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{rating.review}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(rating.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("ratings")}>
                    View All Ratings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Complete history of your service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.servicesBooked.map((service, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                      <div
                        className={`rounded-full p-2 ${service.serviceType === "mechanic" ? "bg-blue-100" : service.serviceType === "fuel" ? "bg-green-100" : "bg-purple-100"}`}
                      >
                        {getServiceIcon(service.serviceType)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)} Service
                          </p>
                          <Badge
                            variant={
                              service.status === "completed"
                                ? "default"
                                : service.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Provider: {service.helper.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(service.requestTime)}
                          {service.completionTime && <span> - {formatDate(service.completionTime)}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {service.helper.phone}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${service.finalPrice || service.estimatedPrice}</p>
                        <p className="text-xs text-muted-foreground">{service.distance} km</p>
                        {service.status === "pending" && (
                          <Button variant="outline" size="sm" className="mt-2">
                            Track
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Ratings</CardTitle>
                <CardDescription>Ratings and reviews you've given to service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.ratingsGiven.map((rating, index) => (
                    <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{rating.helper.name}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{rating.review}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(rating.createdAt)}</p>
                      <Button variant="outline" size="sm">
                        Edit Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-lg font-medium">{userData.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                      </p>
                      <Button variant="outline" size="sm">
                        Change Profile Picture
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm">{userData.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{userData.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{userData.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm">{userData.location.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Account Statistics</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                        <p className="text-lg font-medium">{totalBookings}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                        <p className="text-lg font-medium">${userData.totalMoneySpent}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">Ratings Given</p>
                        <p className="text-lg font-medium">{userData.ratingsGiven.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset Password</Button>
                <Button>Update Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
