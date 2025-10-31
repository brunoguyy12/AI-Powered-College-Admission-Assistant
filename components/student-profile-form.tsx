"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { StudentProfile } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { toast } from "sonner"

interface StudentProfileFormProps {
  studentProfile: StudentProfile | null
  userId: string
}

export function StudentProfileForm({ studentProfile, userId }: StudentProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    gpa: studentProfile?.gpa?.toString() || "",
    satScore: studentProfile?.satScore?.toString() || "",
    actScore: studentProfile?.actScore?.toString() || "",
    toeflScore: studentProfile?.toeflScore?.toString() || "",
    ieltsScore: studentProfile?.ieltsScore?.toString() || "",
    country: studentProfile?.country || "",
    state: studentProfile?.state || "",
    highSchool: studentProfile?.highSchool || "",
    graduationYear: studentProfile?.graduationYear?.toString() || "",
    preferredStudyCountry: studentProfile?.preferredStudyCountry || "",
    budgetMin: studentProfile?.budgetMin?.toString() || "",
    budgetMax: studentProfile?.budgetMax?.toString() || "",
    majorInterests: studentProfile?.majorInterests?.join(", ") || "",
    careerGoals: studentProfile?.careerGoals || "",
    needsFinancialAid: studentProfile?.needsFinancialAid || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/students/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          gpa: formData.gpa ? Number.parseFloat(formData.gpa) : null,
          satScore: formData.satScore ? Number.parseInt(formData.satScore) : null,
          actScore: formData.actScore ? Number.parseInt(formData.actScore) : null,
          toeflScore: formData.toeflScore ? Number.parseInt(formData.toeflScore) : null,
          ieltsScore: formData.ieltsScore ? Number.parseFloat(formData.ieltsScore) : null,
          graduationYear: formData.graduationYear ? Number.parseInt(formData.graduationYear) : null,
          budgetMin: formData.budgetMin ? Number.parseFloat(formData.budgetMin) : null,
          budgetMax: formData.budgetMax ? Number.parseFloat(formData.budgetMax) : null,
          majorInterests: formData.majorInterests.split(",").map((s) => s.trim()),
        }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast.success("Profile updated successfully!")
      // router.refresh()
      //Navigate back to the dashboard or previous page
      router.push("/dashboard/student")
    } catch (error) {
      toast.error("Failed to update profile")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
          <CardDescription>Your test scores and GPA</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="gpa">GPA</FieldLabel>
                  <Input
                    id="gpa"
                    name="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="3.8"
                    value={formData.gpa}
                    onChange={handleChange}
                  />
                  <FieldDescription>On a 4.0 scale</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="satScore">SAT Score</FieldLabel>
                  <Input
                    id="satScore"
                    name="satScore"
                    type="number"
                    min="0"
                    max="1600"
                    placeholder="1500"
                    value={formData.satScore}
                    onChange={handleChange}
                  />
                  <FieldDescription>Out of 1600</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="actScore">ACT Score</FieldLabel>
                  <Input
                    id="actScore"
                    name="actScore"
                    type="number"
                    min="0"
                    max="36"
                    placeholder="34"
                    value={formData.actScore}
                    onChange={handleChange}
                  />
                  <FieldDescription>Out of 36</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="toeflScore">TOEFL Score</FieldLabel>
                  <Input
                    id="toeflScore"
                    name="toeflScore"
                    type="number"
                    min="0"
                    max="120"
                    placeholder="110"
                    value={formData.toeflScore}
                    onChange={handleChange}
                  />
                  <FieldDescription>Out of 120 (if applicable)</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="ieltsScore">IELTS Score</FieldLabel>
                  <Input
                    id="ieltsScore"
                    name="ieltsScore"
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder="7.5"
                    value={formData.ieltsScore}
                    onChange={handleChange}
                  />
                  <FieldDescription>Out of 9 (if applicable)</FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your background and location</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    name="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="state">State/Province</FieldLabel>
                  <Input
                    id="state"
                    name="state"
                    placeholder="California"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="highSchool">High School</FieldLabel>
                  <Input
                    id="highSchool"
                    name="highSchool"
                    placeholder="Your High School Name"
                    value={formData.highSchool}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="graduationYear">Graduation Year</FieldLabel>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    min="2020"
                    max="2030"
                    placeholder="2024"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Preferences</CardTitle>
          <CardDescription>Where and how much are you willing to spend?</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="preferredStudyCountry">Preferred Study Country</FieldLabel>
                <Input
                  id="preferredStudyCountry"
                  name="preferredStudyCountry"
                  placeholder="e.g., United States, Canada, United Kingdom"
                  value={formData.preferredStudyCountry}
                  onChange={handleChange}
                />
                <FieldDescription>Where would you like to study?</FieldDescription>
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="budgetMin">Minimum Annual Budget (USD)</FieldLabel>
                  <Input
                    id="budgetMin"
                    name="budgetMin"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={formData.budgetMin}
                    onChange={handleChange}
                  />
                  <FieldDescription>Minimum tuition you can afford</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="budgetMax">Maximum Annual Budget (USD)</FieldLabel>
                  <Input
                    id="budgetMax"
                    name="budgetMax"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="100000"
                    value={formData.budgetMax}
                    onChange={handleChange}
                  />
                  <FieldDescription>Maximum tuition you can afford</FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Interests</CardTitle>
          <CardDescription>Your goals and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="majorInterests">Major Interests</FieldLabel>
                <Input
                  id="majorInterests"
                  name="majorInterests"
                  placeholder="Computer Science, Engineering, Business"
                  value={formData.majorInterests}
                  onChange={handleChange}
                />
                <FieldDescription>Separate multiple interests with commas</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="careerGoals">Career Goals</FieldLabel>
                <Textarea
                  id="careerGoals"
                  name="careerGoals"
                  placeholder="Describe your career aspirations..."
                  rows={4}
                  value={formData.careerGoals}
                  onChange={handleChange}
                />
              </Field>

              <Field orientation="horizontal">
                <input
                  id="needsFinancialAid"
                  name="needsFinancialAid"
                  type="checkbox"
                  checked={formData.needsFinancialAid}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <FieldLabel htmlFor="needsFinancialAid" className="font-normal">
                  I need financial aid
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
