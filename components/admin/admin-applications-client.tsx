"use client"

import { useState } from "react"
import Link from "next/link"
import type { Application, User, StudentProfile } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { FileText, ExternalLink } from "lucide-react"

interface ApplicationWithStudent extends Application {
  student: User & { studentProfile: StudentProfile | null }
}

interface AdminApplicationsClientProps {
  applications: ApplicationWithStudent[]
}

export function AdminApplicationsClient({ applications }: AdminApplicationsClientProps) {
  const [selectedApp, setSelectedApp] = useState<ApplicationWithStudent | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      WAITLISTED: "bg-orange-100 text-orange-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const handleUpdateApplication = async () => {
    if (!selectedApp) return

    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: newStatus || selectedApp.status,
          adminNotes,
        }),
      })

      if (!response.ok) throw new Error("Failed to update application")

      toast.success("Application updated successfully!")
      setSelectedApp(null)
      setAdminNotes("")
      setNewStatus("")
      // Refresh page or update state
      window.location.reload()
    } catch (error) {
      toast.error("Failed to update application")
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Applications List */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Applications Queue</CardTitle>
            <CardDescription>{applications.length} total applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet</p>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedApp?.id === app.id ? "bg-primary/10 border-primary" : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{app.universityName}</h4>
                        <p className="text-sm text-muted-foreground">{app.student.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{app.programName}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted: {app.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Details */}
      {selectedApp && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applicant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-semibold">{selectedApp.student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{selectedApp.student.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">GPA</p>
                <p className="font-semibold">{selectedApp.student.studentProfile?.gpa || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="text-sm">{selectedApp.student.studentProfile?.country || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select value={newStatus || selectedApp.status} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="notes">Admin Notes</FieldLabel>
                <Textarea
                  id="notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this application..."
                  rows={4}
                  className="resize-none"
                />
              </Field>

              <div className="space-y-2">
                <Button onClick={handleUpdateApplication} disabled={isUpdating} className="w-full">
                  Update Application
                </Button>
                <Link href={`/admin/applications/${selectedApp.id}`} className="block">
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    View Full Details
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* SOP Display */}
          {selectedApp.statementOfPurpose && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Statement of Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm max-h-40 overflow-y-auto bg-muted/50 p-3 rounded text-muted-foreground">
                  {selectedApp.statementOfPurpose}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
