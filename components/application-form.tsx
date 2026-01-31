"use client"

import { useState } from "react"
import type { University, StudentProfile } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { toast } from "sonner"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface ApplicationFormProps {
  userId: string
  university: University
  studentProfile: StudentProfile | null
}

export function ApplicationForm({ userId, university, studentProfile }: ApplicationFormProps) {
  const [activeTab, setActiveTab] = useState("requirements")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    programName: "",
    degree: "Bachelor",
    statementOfPurpose: "",
    essayResponses: [""],
  })

  const handleGenerateSOP = async () => {
    if (!formData.programName) {
      toast.error("Please enter a program name first")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/sop/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          universityName: university.name,
          programName: formData.programName,
          topic: `Why I want to study ${formData.programName} at ${university.name}`,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate SOP")

      const { sop } = await response.json()
      setFormData((prev) => ({ ...prev, statementOfPurpose: sop }))
      toast.success("SOP generated successfully!")
      setActiveTab("sop")
    } catch (error) {
      toast.error("Failed to generate SOP")
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitApplication = async () => {
    if (!formData.programName || !formData.statementOfPurpose) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          universityName: university.name,
          programName: formData.programName,
          degree: formData.degree,
          statementOfPurpose: formData.statementOfPurpose,
          essayResponses: formData.essayResponses.filter((e) => e.trim()),
          status: "SUBMITTED",
        }),
      })

      if (!response.ok) throw new Error("Failed to submit application")

      toast.success("Application submitted successfully!")
      setFormData({
        programName: "",
        degree: "Bachelor",
        statementOfPurpose: "",
        essayResponses: [""],
      })
    } catch (error) {
      toast.error("Failed to submit application")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressSteps = [
    { id: "requirements", label: "Requirements", completed: true },
    { id: "details", label: "Application Details", completed: !!formData.programName },
    { id: "sop", label: "Statement of Purpose", completed: !!formData.statementOfPurpose },
    { id: "essays", label: "Essays", completed: formData.essayResponses.some((e) => e.trim()) },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Application to {university.name}</CardTitle>
          <CardDescription>Complete your application step by step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Application Progress</h3>
            <div className="flex items-center justify-between">
              {progressSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full font-semibold text-sm cursor-pointer transition-all ${
                      step.completed
                        ? "bg-primary text-white"
                        : activeTab === step.id
                          ? "bg-accent text-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab(step.id)}
                  >
                    {step.completed ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  {idx < progressSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${step.completed ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="sop">SOP</TabsTrigger>
              <TabsTrigger value="essays">Essays</TabsTrigger>
            </TabsList>

            <TabsContent value="requirements" className="space-y-4 mt-4">
              <div className="space-y-6">
                {university.documentsNeeded && university.documentsNeeded.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">Required Documents</h3>
                    </div>
                    <div className="space-y-3 pl-7">
                      {university.documentsNeeded.map((doc) => (
                        <div key={doc} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <input type="checkbox" id={doc} className="rounded h-4 w-4 cursor-pointer" />
                          <label htmlFor={doc} className="text-sm font-medium cursor-pointer flex-1">
                            {doc}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {university.applicationFee !== null && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Application Fee</p>
                    <p className="text-2xl font-bold text-primary">
                      {university.applicationFee === 0 ? "Free" : `$${university.applicationFee}`}
                    </p>
                  </div>
                )}

                {university.requirementsSummary && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-semibold mb-2">Additional Requirements</h4>
                    <p className="text-sm text-muted-foreground">{university.requirementsSummary}</p>
                  </div>
                )}

                <Button onClick={() => setActiveTab("details")} className="w-full">
                  Continue to Application Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="programName">Program Name *</FieldLabel>
                  <Input
                    id="programName"
                    placeholder="e.g., Computer Science, MBA, Software Engineering"
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                    className="text-base"
                  />
                  <FieldDescription>What program are you applying for?</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="degree">Degree Level</FieldLabel>
                  <select
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">PhD</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </Field>

                <Button onClick={() => setActiveTab("sop")} disabled={!formData.programName} className="w-full">
                  Next: Write Statement of Purpose
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sop" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold">Statement of Purpose</h3>
                    <p className="text-sm text-muted-foreground">
                      Explain your motivations for studying {formData.programName} at {university.name}
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateSOP}
                    disabled={isGenerating || !formData.programName}
                    variant="outline"
                    size="sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "✨ Generate with AI"
                    )}
                  </Button>
                </div>

                <Field>
                  <FieldLabel htmlFor="sop">Your Statement *</FieldLabel>
                  <Textarea
                    id="sop"
                    value={formData.statementOfPurpose}
                    onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                    placeholder="Write your statement of purpose here or generate one using AI..."
                    rows={12}
                    className="resize-none text-base"
                  />
                  <FieldDescription>
                    Recommended length: 500-700 words. {formData.statementOfPurpose.split(" ").length} words
                  </FieldDescription>
                </Field>

                <Button
                  onClick={() => setActiveTab("essays")}
                  disabled={!formData.statementOfPurpose}
                  className="w-full"
                >
                  Next: Additional Essays
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="essays" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Additional Essays</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {university.requirementsSummary || "Complete any additional essays required by the university"}
                  </p>
                </div>

                {formData.essayResponses.map((essay, index) => (
                  <Field key={index}>
                    <FieldLabel htmlFor={`essay-${index}`}>Essay {index + 1}</FieldLabel>
                    <Textarea
                      id={`essay-${index}`}
                      value={essay}
                      onChange={(e) => {
                        const newEssays = [...formData.essayResponses]
                        newEssays[index] = e.target.value
                        setFormData({ ...formData, essayResponses: newEssays })
                      }}
                      placeholder={`Essay ${index + 1} response...`}
                      rows={8}
                      className="resize-none text-base"
                    />
                  </Field>
                ))}

                {formData.essayResponses.length < 3 && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        essayResponses: [...formData.essayResponses, ""],
                      })
                    }
                  >
                    + Add Another Essay
                  </Button>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting || !formData.statementOfPurpose}
                    size="lg"
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
