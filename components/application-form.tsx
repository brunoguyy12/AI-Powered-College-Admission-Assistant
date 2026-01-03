"use client";

import { useState } from "react";
import type { University, StudentProfile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  userId: string;
  university: University;
  studentProfile: StudentProfile | null;
}

export function ApplicationForm({
  userId,
  university,
  studentProfile,
}: ApplicationFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    statementOfPurpose: "",
    essayResponses: [""] as string[],
    additionalInfo: "",
  });

  const handleGenerateSOP = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/sop/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          universityName: university.name,
          programName: "Your Program",
          topic: `Why I want to study at ${university.name}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate SOP");

      const { sop } = await response.json();
      setFormData((prev) => ({ ...prev, statementOfPurpose: sop }));
      toast.success("SOP generated successfully!");
    } catch (error) {
      toast.error("Failed to generate SOP");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          universityName: university.name,
          programName: "Your Program",
          degree: "Bachelor",
          statementOfPurpose: formData.statementOfPurpose,
          essayResponses: formData.essayResponses,
          status: "SUBMITTED",
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");

      toast.success(
        "Application submitted successfully! Admins will review it shortly."
      );
      setFormData({
        statementOfPurpose: "",
        essayResponses: [""],
        additionalInfo: "",
      });
      // Reset form
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application to {university.name}</CardTitle>
          <CardDescription>
            Complete your application with SOP and essays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="basic"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="sop">Statement of Purpose</TabsTrigger>
              <TabsTrigger value="essays">Essays</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">
                    Application Requirements
                  </h3>
                  {university.documentsNeeded &&
                  university.documentsNeeded.length > 0 ? (
                    <div className="space-y-2">
                      {university.documentsNeeded.map((doc) => (
                        <div key={doc} className="flex items-center gap-2">
                          <input type="checkbox" id={doc} className="rounded" />
                          <label htmlFor={doc} className="text-sm">
                            {doc}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific documents required
                    </p>
                  )}
                </div>

                {university.applicationFee !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Application Fee
                    </p>
                    <p className="text-lg font-semibold">
                      {university.applicationFee === 0
                        ? "Free"
                        : `$${university.applicationFee}`}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sop" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Statement of Purpose</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell us why you want to study at this university
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateSOP}
                    disabled={isGenerating}
                    variant="outline"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate with AI"
                    )}
                  </Button>
                </div>

                <Field>
                  <FieldLabel htmlFor="sop">Statement of Purpose</FieldLabel>
                  <Textarea
                    id="sop"
                    value={formData.statementOfPurpose}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statementOfPurpose: e.target.value,
                      })
                    }
                    placeholder="Write your statement of purpose here or generate one using AI..."
                    rows={10}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended length: 500-700 words
                  </p>
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="essays" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Additional Essays</h3>
                <p className="text-sm text-muted-foreground">
                  {university.requirementsSummary ||
                    "Complete any additional essays required"}
                </p>

                {formData.essayResponses.map((essay, index) => (
                  <Field key={index}>
                    <FieldLabel htmlFor={`essay-${index}`}>
                      Essay {index + 1}
                    </FieldLabel>
                    <Textarea
                      id={`essay-${index}`}
                      value={essay}
                      onChange={(e) => {
                        const newEssays = [...formData.essayResponses];
                        newEssays[index] = e.target.value;
                        setFormData({ ...formData, essayResponses: newEssays });
                      }}
                      placeholder={`Essay ${index + 1} response...`}
                      rows={6}
                      className="resize-none"
                    />
                  </Field>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
