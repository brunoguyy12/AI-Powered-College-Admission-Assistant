"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps = {}) {
  const pathname = usePathname()

  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    "/dashboard/student": [{ label: "Dashboard", href: "/dashboard/student" }],
    "/profile": [{ label: "Profile", href: "/profile" }],
    "/recommendations": [{ label: "Recommendations", href: "/recommendations" }],
    "/applications": [{ label: "Applications", href: "/applications" }],
    "/chatbot": [{ label: "Chatbot", href: "/chatbot" }],
    "/admin/universities": [
      { label: "Admin", href: "/dashboard/admin" },
      { label: "Universities", href: "/admin/universities" },
    ],
    "/admin/students": [
      { label: "Admin", href: "/dashboard/admin" },
      { label: "Students", href: "/admin/students" },
    ],
    "/admin/applications": [
      { label: "Admin", href: "/dashboard/admin" },
      { label: "Applications", href: "/admin/applications" },
    ],
    "/admin/partnerships": [
      { label: "Admin", href: "/dashboard/admin" },
      { label: "Partnerships", href: "/admin/partnerships" },
    ],
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    // If items are provided as props, use them (takes priority)
    if (items && items.length > 0) {
      return items
    }

    // Otherwise use the route-based mapping
    for (const [route, breadcrumbs] of Object.entries(breadcrumbMap)) {
      if (pathname === route || pathname.startsWith(route + "/")) {
        return breadcrumbs
      }
    }
    return []
  }

  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((crumb) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
