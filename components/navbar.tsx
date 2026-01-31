"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<"STUDENT" | "ADMIN" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/auth/role")
        const data = await response.json()
        setUserRole(data.role)
      } catch (error) {
        console.error("Failed to fetch user role:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const studentLinks = [
    { href: "/dashboard/student", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/recommendations", label: "Recommendations" },
    { href: "/applications", label: "Applications" },
    { href: "/chatbot", label: "Chat" },
  ]

  const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/admin/universities", label: "Universities" },
    { href: "/admin/applications", label: "Applications" },
    { href: "/admin/students", label: "Students" },
    { href: "/admin/analytics", label: "Analytics" },
  ]

  const navLinks = userRole === "ADMIN" ? adminLinks : studentLinks

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold hidden sm:inline">AdmitAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <SignedIn>
            {!isLoading &&
              navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive(link.href) ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
          </SignedIn>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
