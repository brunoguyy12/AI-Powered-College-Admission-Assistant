// "use client";

// import { useState } from "react";
// import type { University, Program, User } from "@prisma/client";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Globe, FileText } from "lucide-react";
// import Link from "next/link";

// interface UniversityDetailClientProps {
//   university: University & { programs: Program[] };
//   //   user: User;
// }

// export function UniversityDetailClient({
//   university,
// }: //   user,
// UniversityDetailClientProps) {
//   const [activeTab, setActiveTab] = useState("overview");

//   const getCountryFlag = (country: string): string => {
//     const countryFlags: Record<string, string> = {
//       "United States": "🇺🇸",
//       USA: "🇺🇸",
//       "United Kingdom": "🇬🇧",
//       UK: "🇬🇧",
//       Canada: "🇨🇦",
//       Australia: "🇦🇺",
//       Germany: "🇩🇪",
//       France: "🇫🇷",
//       Italy: "🇮🇹",
//       Spain: "🇪🇸",
//       Netherlands: "🇳🇱",
//       Switzerland: "🇨🇭",
//       Sweden: "🇸🇪",
//       Japan: "🇯🇵",
//       Singapore: "🇸🇬",
//       "South Korea": "🇰🇷",
//       India: "🇮🇳",
//       China: "🇨🇳",
//     };
//     return countryFlags[country] || "🌍";
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <div className="flex items-start justify-between gap-4 flex-wrap">
//           <div className="flex items-start gap-4">
//             <div className="text-5xl">{getCountryFlag(university.country)}</div>
//             <div>
//               <h1 className="text-4xl font-bold">{university.name}</h1>
//               <p className="text-lg text-muted-foreground mt-2">
//                 {university.city}, {university.country}
//               </p>
//               {university.location && (
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {university.location}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="text-right">
//             {university.worldRanking && (
//               <div className="mb-2">
//                 <div className="text-3xl font-bold text-primary">
//                   #{university.worldRanking}
//                 </div>
//                 <p className="text-sm text-muted-foreground">World Ranking</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-6 flex gap-3 flex-wrap">
//           {university.websiteUrl && (
//             <a
//               href={university.websiteUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Button variant="outline" size="sm">
//                 <Globe className="h-4 w-4 mr-2" />
//                 Visit Website
//               </Button>
//             </a>
//           )}
//           <Button size="sm">
//             <FileText className="h-4 w-4 mr-2" />
//             Start Application
//           </Button>
//         </div>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <Tabs
//             defaultValue="overview"
//             value={activeTab}
//             onValueChange={setActiveTab}
//           >
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="academics">Academics</TabsTrigger>
//               <TabsTrigger value="requirements">Requirements</TabsTrigger>
//               <TabsTrigger value="programs">Programs</TabsTrigger>
//             </TabsList>

//             <TabsContent value="overview" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>University Overview</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
//                     {university.acceptanceRate !== null && (
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           Acceptance Rate
//                         </p>
//                         <p className="text-2xl font-bold">
//                           {university.acceptanceRate}%
//                         </p>
//                       </div>
//                     )}
//                     {university.tuitionFee && (
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           Annual Tuition
//                         </p>
//                         <p className="text-2xl font-bold">
//                           ${(university.tuitionFee / 1000).toFixed(0)}K
//                         </p>
//                       </div>
//                     )}
//                     {university.averageAid && (
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           Avg. Financial Aid
//                         </p>
//                         <p className="text-2xl font-bold">
//                           ${(university.averageAid / 1000).toFixed(0)}K
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="academics" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Admission Standards</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     {university.averageGPA && (
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           Average GPA
//                         </p>
//                         <p className="text-2xl font-bold">
//                           {university.averageGPA}
//                         </p>
//                       </div>
//                     )}
//                     {university.averageSAT && (
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           Average SAT Score
//                         </p>
//                         <p className="text-2xl font-bold">
//                           {university.averageSAT}
//                         </p>
//                       </div>
//                     )}
//                     {university.averageACT && (
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">
//                           Average ACT Score
//                         </p>
//                         <p className="text-2xl font-bold">
//                           {university.averageACT}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="requirements" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Application Requirements</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {university.requirementsSummary && (
//                     <div>
//                       <p className="text-sm font-medium mb-2">Overview</p>
//                       <p className="text-sm text-muted-foreground">
//                         {university.requirementsSummary}
//                       </p>
//                     </div>
//                   )}

//                   {university.documentsNeeded &&
//                     university.documentsNeeded.length > 0 && (
//                       <div>
//                         <p className="text-sm font-medium mb-2">
//                           Documents Needed
//                         </p>
//                         <div className="space-y-1">
//                           {university.documentsNeeded.map((doc) => (
//                             <div key={doc} className="flex items-center gap-2">
//                               <FileText className="h-4 w-4 text-primary" />
//                               <span className="text-sm">{doc}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                   {university.applicationFee !== null && (
//                     <div>
//                       <p className="text-sm font-medium">Application Fee</p>
//                       <p className="text-lg font-semibold">
//                         {university.applicationFee === 0
//                           ? "Free"
//                           : `$${university.applicationFee}`}
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="programs" className="space-y-4">
//               {university.programs && university.programs.length > 0 ? (
//                 <div className="space-y-2">
//                   {university.programs.map((program) => (
//                     <Card key={program.id}>
//                       <CardHeader>
//                         <CardTitle className="text-lg">
//                           {program.name}
//                         </CardTitle>
//                         <CardDescription>
//                           {program.degree} in {program.field}
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid grid-cols-2 gap-4">
//                           {program.duration && (
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Duration
//                               </p>
//                               <p className="font-medium">
//                                 {program.duration} years
//                               </p>
//                             </div>
//                           )}
//                           {program.minGPA && (
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Min. GPA
//                               </p>
//                               <p className="font-medium">{program.minGPA}</p>
//                             </div>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <Card>
//                   <CardContent className="pt-6">
//                     <p className="text-sm text-muted-foreground">
//                       No programs listed yet.
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>

//         <div className="space-y-4">
//           <Card className="sticky top-20">
//             <CardHeader>
//               <CardTitle>Ready to Apply?</CardTitle>
//               <CardDescription>Start your application today</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Button className="w-full" size="lg">
//                 <FileText className="h-4 w-4 mr-2" />
//                 Start Application
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full bg-transparent"
//                 asChild
//               >
//                 <Link href="/chatbot">Ask Questions</Link>
//               </Button>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Quick Stats</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Acceptance Rate
//                 </span>
//                 <Badge>{university.acceptanceRate}%</Badge>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">
//                   Annual Tuition
//                 </span>
//                 <Badge variant="outline">
//                   ${(university.tuitionFee || 0) / 1000}K
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import type { University, Program, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, FileText } from "lucide-react";
import Link from "next/link";
import { ApplicationForm } from "./application-form";

interface UniversityDetailClientProps {
  university: University & { programs: Program[] };
  user: User;
}

export function UniversityDetailClient({
  university,
  user,
}: UniversityDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const getCountryFlag = (country: string): string => {
    const countryFlags: Record<string, string> = {
      "United States": "🇺🇸",
      USA: "🇺🇸",
      "United Kingdom": "🇬🇧",
      UK: "🇬🇧",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Italy: "🇮🇹",
      Spain: "🇪🇸",
      Netherlands: "🇳🇱",
      Switzerland: "🇨🇭",
      Sweden: "🇸🇪",
      Japan: "🇯🇵",
      Singapore: "🇸🇬",
      "South Korea": "🇰🇷",
      India: "🇮🇳",
      China: "🇨🇳",
    };
    return countryFlags[country] || "🌍";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{getCountryFlag(university.country)}</div>
            <div>
              <h1 className="text-4xl font-bold">{university.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">
                {university.city}, {university.country}
              </p>
              {university.location && (
                <p className="text-sm text-muted-foreground mt-1">
                  {university.location}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            {university.worldRanking && (
              <div className="mb-2">
                <div className="text-3xl font-bold text-primary">
                  #{university.worldRanking}
                </div>
                <p className="text-sm text-muted-foreground">World Ranking</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          {university.websiteUrl && (
            <a
              href={university.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </a>
          )}
          <Button
            size="sm"
            onClick={() => setShowApplicationForm(!showApplicationForm)}
          >
            <FileText className="h-4 w-4 mr-2" />
            {showApplicationForm ? "Hide Application" : "Start Application"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>University Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {university.acceptanceRate !== null && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Acceptance Rate
                        </p>
                        <p className="text-2xl font-bold">
                          {university.acceptanceRate}%
                        </p>
                      </div>
                    )}
                    {university.tuitionFee && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Annual Tuition
                        </p>
                        <p className="text-2xl font-bold">
                          ${(university.tuitionFee / 1000).toFixed(0)}K
                        </p>
                      </div>
                    )}
                    {university.averageAid && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Avg. Financial Aid
                        </p>
                        <p className="text-2xl font-bold">
                          ${(university.averageAid / 1000).toFixed(0)}K
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admission Standards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {university.averageGPA && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Average GPA
                        </p>
                        <p className="text-2xl font-bold">
                          {university.averageGPA}
                        </p>
                      </div>
                    )}
                    {university.averageSAT && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Average SAT Score
                        </p>
                        <p className="text-2xl font-bold">
                          {university.averageSAT}
                        </p>
                      </div>
                    )}
                    {university.averageACT && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Average ACT Score
                        </p>
                        <p className="text-2xl font-bold">
                          {university.averageACT}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {university.requirementsSummary && (
                    <div>
                      <p className="text-sm font-medium mb-2">Overview</p>
                      <p className="text-sm text-muted-foreground">
                        {university.requirementsSummary}
                      </p>
                    </div>
                  )}

                  {university.documentsNeeded &&
                    university.documentsNeeded.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Documents Needed
                        </p>
                        <div className="space-y-1">
                          {university.documentsNeeded.map((doc) => (
                            <div key={doc} className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {university.applicationFee !== null && (
                    <div>
                      <p className="text-sm font-medium">Application Fee</p>
                      <p className="text-lg font-semibold">
                        {university.applicationFee === 0
                          ? "Free"
                          : `$${university.applicationFee}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="programs" className="space-y-4">
              {university.programs && university.programs.length > 0 ? (
                <div className="space-y-2">
                  {university.programs.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {program.name}
                        </CardTitle>
                        <CardDescription>
                          {program.degree} in {program.field}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {program.duration && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Duration
                              </p>
                              <p className="font-medium">
                                {program.duration} years
                              </p>
                            </div>
                          )}
                          {program.minGPA && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Min. GPA
                              </p>
                              <p className="font-medium">{program.minGPA}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      No programs listed yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ready to Apply?</CardTitle>
              <CardDescription>Start your application today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowApplicationForm(!showApplicationForm)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Start Application
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href="/chatbot">Ask Questions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Acceptance Rate
                </span>
                <Badge>{university.acceptanceRate}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Annual Tuition
                </span>
                <Badge variant="outline">
                  ${(university.tuitionFee || 0) / 1000}K
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showApplicationForm && (
        <div className="mt-8">
          <ApplicationForm
            userId={user.id}
            university={university}
            studentProfile={null}
          />
        </div>
      )}
    </div>
  );
}
