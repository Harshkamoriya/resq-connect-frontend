"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Fuel, Wrench, Truck, Battery, Key, Anchor, MapPin, Clock, Shield, ThumbsUp, ChevronRight } from "lucide-react"
import { Button } from "components/ui/button"
import { Card, CardContent } from "components/ui/card"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState({
    mission: false,
    services: false,
    how: false,
    values: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const mission = document.getElementById("mission")
      const services = document.getElementById("services")
      const how = document.getElementById("how")
      const values = document.getElementById("values")

      if (mission) {
        setIsVisible((prev) => ({
          ...prev,
          mission: isElementInViewport(mission),
        }))
      }

      if (services) {
        setIsVisible((prev) => ({
          ...prev,
          services: isElementInViewport(services),
        }))
      }

      if (how) {
        setIsVisible((prev) => ({
          ...prev,
          how: isElementInViewport(how),
        }))
      }

      if (values) {
        setIsVisible((prev) => ({
          ...prev,
          values: isElementInViewport(values),
        }))
      }
    }

    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const serviceItems = [
    {
      title: "Fuel Delivery",
      icon: <Fuel className="h-10 w-10 text-white" />,
      description: "Run out of gas? We'll deliver fuel to your location so you can get back on the road quickly.",
      color: "from-amber-500 to-orange-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Mechanic Services",
      icon: <Wrench className="h-10 w-10 text-white" />,
      description: "Professional mechanics available to diagnose and fix common vehicle issues on the spot.",
      color: "from-blue-500 to-cyan-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Flat Tire Assistance",
      icon: <Truck className="h-10 w-10 text-white" />,
      description: "Quick tire change or repair services to get you rolling again safely.",
      color: "from-red-500 to-rose-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Towing Service",
      icon: <Truck className="h-10 w-10 text-white" />,
      description: "When repairs aren't possible on-site, we'll tow your vehicle to a repair shop of your choice.",
      color: "from-purple-500 to-indigo-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Battery Jump Start",
      icon: <Battery className="h-10 w-10 text-white" />,
      description: "Dead battery? Our helpers will jump-start your vehicle or replace the battery if needed.",
      color: "from-green-500 to-emerald-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Lockout Service",
      icon: <Key className="h-10 w-10 text-white" />,
      description: "Locked your keys in your car? Our specialists will help you regain access to your vehicle.",
      color: "from-yellow-500 to-amber-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Winch Service",
      icon: <Anchor className="h-10 w-10 text-white" />,
      description: "If your vehicle is stuck in mud, snow, or a ditch, our winch service will pull you out safely.",
      color: "from-teal-500 to-cyan-600",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white">
        <div className="absolute inset-0 overflow-hidden mix-blend-overlay opacity-20">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Roadside assistance"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="container relative z-20 mx-auto px-4 py-24 sm:py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium text-sm">
              24/7 Roadside Assistance
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                ResQ-Connect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connecting you with reliable roadside assistance when you need it most.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                asChild
              >
                <Link href="/services">
                  Our Services <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="currentColor"
              className="text-background"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.mission ? "visible" : "hidden"}
            className="max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-sm"></div>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt="Our mission"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium text-sm">
                  Our Mission
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Revolutionizing Roadside Assistance
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  At ResQ-Connect, our mission is to revolutionize roadside assistance by creating a platform that
                  connects drivers in need with skilled helpers nearby. We believe that no one should be left stranded
                  on the road.
                </p>
                <p className="text-lg text-muted-foreground">
                  We're committed to providing fast, transparent, and high-quality service through our innovative
                  platform, ensuring peace of mind for every driver on the road.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 md:py-24 bg-gradient-to-b from-background to-muted relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.services ? "visible" : "hidden"}
            className="text-center mb-12"
          >
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium text-sm">
              Our Services
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Comprehensive Roadside Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ResQ-Connect offers a comprehensive range of roadside assistance services to get you back on the road
              quickly and safely.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.services ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {serviceItems.map((service, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color}`}></div>
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover mix-blend-overlay opacity-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${service.color} mr-3`}>{service.icon}</div>
                      <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{service.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                    >
                      Learn more <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.1),transparent_40%)]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.how ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium text-sm">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Simple Process, Fast Results</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to get help when you need it most, with a simple process designed for speed and
              reliability.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.how ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeIn} className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-card rounded-lg p-8 shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-4 inline-flex mb-6 text-white">
                  <MapPin className="h-8 w-8" />
                </div>
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Request Help</h3>
                <p className="text-muted-foreground">
                  Enter your location and select the service you need through our easy-to-use app. Our intelligent
                  system will immediately start searching for nearby helpers.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative mt-8 md:mt-16">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-card rounded-lg p-8 shadow-xl">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-flex mb-6 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Get Connected</h3>
                <p className="text-muted-foreground">
                  We'll match you with available helpers within a 5km radius who can assist you quickly. You'll see
                  their ratings, estimated arrival time, and pricing.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative mt-8 md:mt-32">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-card rounded-lg p-8 shadow-xl">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 inline-flex mb-6 text-white">
                  <ThumbsUp className="h-8 w-8" />
                </div>
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-amber-500 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Problem Solved</h3>
                <p className="text-muted-foreground">
                  Track your helper's arrival in real-time, get your issue resolved, and pay securely through the app.
                  Then rate your experience to help our community.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 transform -translate-y-16"></div>
        </div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        className="py-16 md:py-24 bg-gradient-to-b from-muted to-background relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1920')] bg-fixed bg-center opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.values ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium text-sm">
                Our Values
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Drives Us Forward</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our core values shape everything we do at ResQ-Connect, from how we build our platform to how we serve
                our customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-colors duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Reliability</h3>
                <p className="text-muted-foreground">
                  We understand that roadside emergencies are stressful. That's why we've built a network of vetted,
                  reliable helpers who arrive when promised and deliver quality service every time.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-colors duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Speed</h3>
                <p className="text-muted-foreground">
                  Our platform is designed to connect you with the closest available helper as quickly as possible,
                  minimizing your wait time and getting you back on the road faster.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-colors duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white">
                  <ThumbsUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Transparency</h3>
                <p className="text-muted-foreground">
                  From upfront pricing to real-time tracking of your helper's location, we believe in complete
                  transparency throughout the service process.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1920')] bg-center bg-cover mix-blend-overlay opacity-10"></div>
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="absolute top-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto rotate-180">
            <path
              fill="currentColor"
              className="text-background"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready for Roadside Peace of Mind?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Download the ResQ-Connect app today and join thousands of drivers who never worry about being stranded
              again.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                Download App
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Shield className="h-6 w-6 text-cyan-300" />
                </div>
                <span className="text-blue-100">Vetted Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Clock className="h-6 w-6 text-cyan-300" />
                </div>
                <span className="text-blue-100">24/7 Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <MapPin className="h-6 w-6 text-cyan-300" />
                </div>
                <span className="text-blue-100">Nationwide Coverage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
