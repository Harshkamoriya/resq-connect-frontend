"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, CreditCard, HelpCircle, History, Home, LifeBuoy, LogOut, Settings, Star, UserIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar"

export function UserDashboardSidebar() {
  const [activePath, setActivePath] = useState("/dashboard")

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Bookings", path: "/dashboard/bookings", icon: History },
    { name: "Payments", path: "/dashboard/payments", icon: CreditCard },
    { name: "Ratings", path: "/dashboard/ratings", icon: Star },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Profile", path: "/dashboard/profile", icon: UserIcon },
  ]

  const supportItems = [
    { name: "Help Center", path: "/help", icon: HelpCircle },
    { name: "Contact Support", path: "/support", icon: LifeBuoy },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LifeBuoy className="h-6 w-6" />
          <span>RoadAssist</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={activePath === item.path} onClick={() => setActivePath(item.path)}>
                <Link href={item.path}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarMenu>
          {supportItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={activePath === item.path} onClick={() => setActivePath(item.path)}>
                <Link href={item.path}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
