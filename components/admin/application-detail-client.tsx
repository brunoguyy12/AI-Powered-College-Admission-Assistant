"use client"

import { useState } from "react"
import type { Application, User, StudentProfile } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { FileText, User as UserIcon, Mail, Globe, Calendar } from "lucide-react"

interface ApplicationDetailClientProps {
  application: Application & {
    student: User & { studentProfile: StudentProfile | null }
  }
  user: User
}

export function ApplicationDetailClient({ application, user }: ApplicationDetailClientProps) {
  const [status, setStatus] = useState(application.status)
  const [adminNotes, setAdminNotes] = useState(application.adminNotes || "")
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

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          status,
          adminNotes,
        }),
      })

      if (!response.ok) throw new Error("Failed to update")
      toast.success("Application updated successfully!")
    } catch (error) {
      toast.error("Failed to update application")
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const profile = application.student.studentProfile

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Application Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{application.universityName}</CardTitle>
                <CardDescription>{application.programName} - {application.degree}</CardDescription>
              </div>
              <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
              {application.deadline && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{new Date(application.deadline).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applicant Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold text-lg">{application.student.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="text-sm">{application.student.email}</p>
            </div>
            {profile && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">GPA</p>
                  <p className="font-semibold">{profile.gpa || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-semibold">{profile.country || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Education Level</p>
                  <p className="font-semibold capitalize">{profile.educationLevel}</p>
                </div>
                {profile.majorInterests && profile.majorInterests.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Interests</p>
                    <p className="text-sm">{profile.majorInterests.join(", ")}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* SOP */}
        {application.statementOfPurpose && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Statement of Purpose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                {application.statementOfPurpose}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Essays */}
        {application.additionalEssays && application.additionalEssays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Essays ({application.additionalEssays.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.additionalEssays.map((essay, idx) => (
                <div key={idx} className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-sm mb-2">Essay {idx + 1}</p>
                  <p className="text-sm max-h-32 overflow-y-auto">{essay}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Update Controls */}
      <div className="space-y-6">
        {/* Status Update */}
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel htmlFor="status">Application Status</FieldLabel>
              <Select value={status} onValueChange={setStatus}>
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
                placeholder="Internal notes about this application..."
                rows={4}
                className="resize-none"
              />
            </Field>

            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? "Updating..." : "Update Application"}
            </Button>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {application.adminLastUpdated
                  ? new Date(application.adminLastUpdated).toLocaleDateString()
                  : "Not yet reviewed"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
