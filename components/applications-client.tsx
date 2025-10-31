"use client"

import type React from "react"

import { useState } from "react"
import type { Application } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ApplicationsClientProps {
  userId: string
  initialApplications: Application[]
}

export function ApplicationsClient({ userId, initialApplications }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    universityName: "",
    programName: "",
    degree: "",
    deadline: "",
  })

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentId: userId,
        }),
      })

      if (!response.ok) throw new Error("Failed to add application")

      const newApp = await response.json()
      setApplications([...applications, newApp])
      setFormData({ universityName: "", programName: "", degree: "", deadline: "" })
      setIsOpen(false)
      toast.success("Application added!")
    } catch (error) {
      toast.error("Failed to add application")
      console.error(error)
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Applications</h2>
          <p className="text-muted-foreground">{applications.length} total applications</p>
        </div>
        <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Cancel" : "Add Application"}</Button>
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <FieldSet>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="universityName">University Name</FieldLabel>
                    <Input
                      id="universityName"
                      value={formData.universityName}
                      onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                      placeholder="e.g., Stanford University"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="programName">Program Name</FieldLabel>
                    <Input
                      id="programName"
                      value={formData.programName}
                      onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="degree">Degree</FieldLabel>
                    <Select
                      value={formData.degree}
                      onValueChange={(value) => setFormData({ ...formData, degree: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="deadline">Application Deadline</FieldLabel>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <div className="flex gap-2">
                <Button type="submit">Add Application</Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {applications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications Yet</CardTitle>
            <CardDescription>Start tracking your college applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add your first application to start tracking your progress through the admissions process.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{app.universityName}</CardTitle>
                    <CardDescription>
                      {app.programName} - {app.degree}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {app.deadline && (
                  <p className="text-sm text-muted-foreground">
                    Deadline: {new Date(app.deadline).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
