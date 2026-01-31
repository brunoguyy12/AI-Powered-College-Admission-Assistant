"use client"

import { useState } from "react"
import type { Partnership } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Mail, Phone, User, Calendar, FileText, Plus } from "lucide-react"
import { generatePartnershipEmail, generateFollowUpEmail } from "@/lib/partnership-email"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PartnershipManagementClientProps {
  partnerships: Partnership[]
}

export function PartnershipManagementClient({ partnerships: initialPartnerships }: PartnershipManagementClientProps) {
  const [partnerships, setPartnerships] = useState(initialPartnerships)
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [formData, setFormData] = useState({
    universityName: "",
    universityEmail: "",
    universityPhone: "",
    contactPerson: "",
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      SENT: "bg-blue-100 text-blue-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      NEGOTIATING: "bg-yellow-100 text-yellow-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const handleCreatePartnership = async () => {
    if (!formData.universityName || !formData.universityEmail) {
      toast.error("Please fill in required fields")
      return
    }

    setIsCreating(true)
    try {
      const { subject, content } = generatePartnershipEmail(
        formData.universityName,
        formData.contactPerson
      )

      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          emailSubject: subject,
          emailContent: content,
        }),
      })

      if (!response.ok) throw new Error("Failed to create partnership")

      const newPartnership = await response.json()
      setPartnerships([newPartnership, ...partnerships])
      setFormData({ universityName: "", universityEmail: "", universityPhone: "", contactPerson: "" })
      toast.success("Partnership request created!")
    } catch (error) {
      toast.error("Failed to create partnership")
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSendEmail = async (partnership: Partnership) => {
    try {
      // In a real app, this would integrate with an email service
      await fetch("/api/partnerships", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnershipId: partnership.id,
          status: "SENT",
          sentDate: new Date().toISOString(),
        }),
      })

      toast.success(`Email sent to ${partnership.universityEmail}! (Note: This is simulated. Integrate with email service for production.`)
      
      // Update local state
      setPartnerships(partnerships.map(p => p.id === partnership.id ? { ...p, status: "SENT", sentDate: new Date() } : p))
    } catch (error) {
      toast.error("Failed to send email")
      console.error(error)
    }
  }

  const handleGenerateFollowUp = (partnership: Partnership) => {
    const { subject, content } = generateFollowUpEmail(
      partnership.universityName,
      partnership.contactPerson || undefined,
      partnership.sentDate
    )

    setSelectedPartnership({
      ...partnership,
      emailSubject: subject,
      emailContent: content,
    })
  }

  return (
    <div className="space-y-6">
      {/* Create New Partnership */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Partnership Request
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Partnership Request</DialogTitle>
            <DialogDescription>Generate a beautiful partnership proposal email for a university</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="uni-name">University Name *</FieldLabel>
              <Input
                id="uni-name"
                value={formData.universityName}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                placeholder="e.g., Stanford University"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="uni-email">University Email *</FieldLabel>
              <Input
                id="uni-email"
                type="email"
                value={formData.universityEmail}
                onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                placeholder="admissions@university.edu"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="uni-phone">University Phone</FieldLabel>
              <Input
                id="uni-phone"
                value={formData.universityPhone}
                onChange={(e) => setFormData({ ...formData, universityPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-person">Contact Person Name</FieldLabel>
              <Input
                id="contact-person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Director of Admissions (optional)"
              />
            </Field>

            <Button onClick={handleCreatePartnership} disabled={isCreating} className="w-full">
              {isCreating ? "Creating..." : "Generate & Create Partnership"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Partnerships List */}
      <div className="grid gap-4">
        {partnerships.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No partnerships yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          partnerships.map((partnership) => (
            <Card key={partnership.id} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{partnership.universityName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {partnership.universityEmail}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(partnership.status)}>{partnership.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {partnership.contactPerson && (
                    <div className="flex gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{partnership.contactPerson}</p>
                      </div>
                    </div>
                  )}

                  {partnership.universityPhone && (
                    <div className="flex gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{partnership.universityPhone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(partnership.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {partnership.sentDate && (
                    <div className="flex gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-medium">{new Date(partnership.sentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {partnership.emailContent && (
                  <div>
                    <button
                      onClick={() => setSelectedPartnership(partnership)}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      View Email Template
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  {partnership.status === "DRAFT" && (
                    <Button
                      size="sm"
                      onClick={() => handleSendEmail(partnership)}
                      className="flex-1"
                    >
                      Send Email
                    </Button>
                  )}

                  {partnership.status === "SENT" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateFollowUp(partnership)}
                      className="flex-1"
                    >
                      Generate Follow-up
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Email Preview Modal */}
      {selectedPartnership && (
        <Dialog open={!!selectedPartnership} onOpenChange={() => setSelectedPartnership(null)}>
          <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Partnership Email</DialogTitle>
              <DialogDescription>{selectedPartnership.universityName}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="font-semibold">{selectedPartnership.emailSubject}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Email Content</p>
                <div className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedPartnership.emailContent}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => {
                  navigator.clipboard.writeText(selectedPartnership.emailContent || "")
                  toast.success("Email content copied to clipboard!")
                }}>
                  Copy Email Content
                </Button>
                <Button variant="outline" onClick={() => setSelectedPartnership(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
