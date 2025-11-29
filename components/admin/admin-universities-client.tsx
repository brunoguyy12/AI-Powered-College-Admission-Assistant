"use client";

import { useState } from "react";
import type { University, Program } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Globe } from "lucide-react";

interface AdminUniversitiesClientProps {
  universities: (University & { programs: Program[] })[];
}

export function AdminUniversitiesClient({
  universities,
}: AdminUniversitiesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">University Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all universities in the system
        </p>
      </div>

      <div>
        <Input
          placeholder="Search universities by name or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredUniversities.map((university) => (
          <Card key={university.id}>
            <CardHeader>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>{university.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {university.city}, {university.country}
                  </CardDescription>
                </div>
                <div className="text-right">
                  {university.worldRanking && (
                    <Badge>#{university.worldRanking}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Admin Email
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    <p className="text-sm">
                      {university.adminEmail || "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Admin Phone
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4" />
                    <p className="text-sm">
                      {university.adminPhone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Website
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4" />
                    {university.websiteUrl ? (
                      <a
                        href={university.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit
                      </a>
                    ) : (
                      <p className="text-sm">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="programs">Programs</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Acceptance Rate
                      </p>
                      <p className="text-lg font-semibold">
                        {university.acceptanceRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Avg. GPA
                      </p>
                      <p className="text-lg font-semibold">
                        {university.averageGPA || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Annual Tuition
                      </p>
                      <p className="text-lg font-semibold">
                        ${(university.tuitionFee || 0) / 1000}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Avg. Aid
                      </p>
                      <p className="text-lg font-semibold">
                        ${(university.averageAid || 0) / 1000}K
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Requirements Summary
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {university.requirementsSummary || "Not provided"}
                    </p>
                  </div>
                  {university.documentsNeeded &&
                    university.documentsNeeded.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Documents Needed
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {university.documentsNeeded.map((doc) => (
                            <Badge key={doc} variant="outline">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  {university.applicationFee !== null && (
                    <div>
                      <p className="text-sm font-medium">Application Fee</p>
                      <p className="text-sm">
                        {university.applicationFee === 0
                          ? "Free"
                          : `$${university.applicationFee}`}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="programs" className="mt-4 space-y-2">
                  {university.programs && university.programs.length > 0 ? (
                    university.programs.map((program) => (
                      <Card key={program.id}>
                        <CardContent className="pt-4">
                          <p className="font-medium">{program.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {program.degree} in {program.field}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No programs listed
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
