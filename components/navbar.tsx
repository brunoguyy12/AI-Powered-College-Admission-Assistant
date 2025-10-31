"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold">AdmitAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <SignedIn>
            <Link
              href="/dashboard/student"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/dashboard/student") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/profile") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Profile
            </Link>
            <Link
              href="/recommendations"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/recommendations") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Recommendations
            </Link>
            <Link
              href="/applications"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/applications") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Applications
            </Link>
            <Link
              href="/chatbot"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/chatbot") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Chat
            </Link>
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
