"use client"

import type React from "react"

import { useState } from "react"
import type { University, Program } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

interface UniversitiesClientProps {
  universities: (University & { programs: Program[] })[]
}

export function UniversitiesClient({ universities: initialUniversities }: UniversitiesClientProps) {
  const [universities, setUniversities] = useState(initialUniversities)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
    acceptanceRate: "",
    averageGPA: "",
    averageSAT: "",
    averageACT: "",
    tuitionFee: "",
    averageAid: "",
  })

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          acceptanceRate: formData.acceptanceRate ? Number.parseFloat(formData.acceptanceRate) : null,
          averageGPA: formData.averageGPA ? Number.parseFloat(formData.averageGPA) : null,
          averageSAT: formData.averageSAT ? Number.parseInt(formData.averageSAT) : null,
          averageACT: formData.averageACT ? Number.parseInt(formData.averageACT) : null,
          tuitionFee: formData.tuitionFee ? Number.parseFloat(formData.tuitionFee) : null,
          averageAid: formData.averageAid ? Number.parseFloat(formData.averageAid) : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to add university")

      const newUniversity = await response.json()
      setUniversities([...universities, newUniversity])
      setFormData({
        name: "",
        country: "",
        state: "",
        city: "",
        acceptanceRate: "",
        averageGPA: "",
        averageSAT: "",
        averageACT: "",
        tuitionFee: "",
        averageAid: "",
      })
      setIsOpen(false)
      toast.success("University added!")
    } catch (error) {
      toast.error("Failed to add university")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Universities</h2>
          <p className="text-muted-foreground">{universities.length} universities in database</p>
        </div>
        <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Cancel" : "Add University"}</Button>
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Add New University</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUniversity} className="space-y-4">
              <FieldSet>
                <FieldGroup className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="name">University Name</FieldLabel>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Stanford University"
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="country">Country</FieldLabel>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="United States"
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="state">State</FieldLabel>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="California"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="city">City</FieldLabel>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Stanford"
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="acceptanceRate">Acceptance Rate (%)</FieldLabel>
                      <Input
                        id="acceptanceRate"
                        type="number"
                        step="0.1"
                        value={formData.acceptanceRate}
                        onChange={(e) => setFormData({ ...formData, acceptanceRate: e.target.value })}
                        placeholder="3.9"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="averageGPA">Average GPA</FieldLabel>
                      <Input
                        id="averageGPA"
                        type="number"
                        step="0.01"
                        value={formData.averageGPA}
                        onChange={(e) => setFormData({ ...formData, averageGPA: e.target.value })}
                        placeholder="3.95"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="averageSAT">Average SAT</FieldLabel>
                      <Input
                        id="averageSAT"
                        type="number"
                        value={formData.averageSAT}
                        onChange={(e) => setFormData({ ...formData, averageSAT: e.target.value })}
                        placeholder="1505"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="averageACT">Average ACT</FieldLabel>
                      <Input
                        id="averageACT"
                        type="number"
                        value={formData.averageACT}
                        onChange={(e) => setFormData({ ...formData, averageACT: e.target.value })}
                        placeholder="34"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="tuitionFee">Tuition Fee ($)</FieldLabel>
                      <Input
                        id="tuitionFee"
                        type="number"
                        value={formData.tuitionFee}
                        onChange={(e) => setFormData({ ...formData, tuitionFee: e.target.value })}
                        placeholder="60000"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="averageAid">Average Aid ($)</FieldLabel>
                      <Input
                        id="averageAid"
                        type="number"
                        value={formData.averageAid}
                        onChange={(e) => setFormData({ ...formData, averageAid: e.target.value })}
                        placeholder="50000"
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>

              <div className="flex gap-2">
                <Button type="submit">Add University</Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>University List</CardTitle>
          <CardDescription>All universities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Acceptance Rate</TableHead>
                  <TableHead>Avg GPA</TableHead>
                  <TableHead>Avg SAT</TableHead>
                  <TableHead>Programs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((uni) => (
                  <TableRow key={uni.id}>
                    <TableCell className="font-medium">{uni.name}</TableCell>
                    <TableCell>
                      {uni.city}, {uni.state || uni.country}
                    </TableCell>
                    <TableCell>{uni.acceptanceRate ? `${uni.acceptanceRate}%` : "N/A"}</TableCell>
                    <TableCell>{uni.averageGPA?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell>{uni.averageSAT || "N/A"}</TableCell>
                    <TableCell>{uni.programs.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
