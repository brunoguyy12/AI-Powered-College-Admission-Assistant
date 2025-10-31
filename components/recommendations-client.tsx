"use client"

import { useState } from "react"
import type { StudentProfile, Recommendation } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

interface RecommendationsClientProps {
  userId: string
  studentProfile: StudentProfile | null
  initialRecommendations: Recommendation[]
}

export function RecommendationsClient({ userId, studentProfile, initialRecommendations }: RecommendationsClientProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendationCount, setRecommendationCount] = useState(5)

  const handleGenerateRecommendations = async () => {
    if (!studentProfile?.gpa || !studentProfile?.satScore) {
      toast.error("Please complete your profile first")
      return
    }

    if (recommendationCount < 1 || recommendationCount > 20) {
      toast.error("Please enter a number between 1 and 20")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationCount }),             
      })

      if (!response.ok) throw new Error("Failed to generate recommendations")

      const newRecommendations = await response.json()
      setRecommendations(newRecommendations)
      toast.success(`${newRecommendations.length} recommendations generated successfully!`)
    } catch (error) {
      toast.error("Failed to generate recommendations")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {recommendations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Generate personalized university recommendations powered by AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Based on your academic profile, location preferences, and budget, we'll recommend universities that match
              your goals and achievements. Recommended universities will be added to our database for future reference.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">How many recommendations would you like?</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={recommendationCount}
                  onChange={(e) => setRecommendationCount(Number.parseInt(e.target.value) || 5)}
                  className="w-32"
                  placeholder="5"
                />
                <span className="text-sm text-muted-foreground self-center">(1-20 universities)</span>
              </div>
            </div>
            <Button onClick={handleGenerateRecommendations} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                "Generate Recommendations"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">Your Top Matches</h2>
              <p className="text-muted-foreground">{recommendations.length} universities recommended for you</p>
            </div>
            <div className="flex gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Generate more</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={recommendationCount}
                    onChange={(e) => setRecommendationCount(Number.parseInt(e.target.value) || 5)}
                    className="w-20"
                  />
            <Button onClick={handleGenerateRecommendations} disabled={isLoading} variant="outline">
              {isLoading ? "Generating..." : "Regenerate"}
            </Button>
            </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <CardTitle>{rec.universityName}</CardTitle>
                      <CardDescription className="mt-2">{rec.reasoning}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{rec.matchScore}%</div>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Match Score</p>
                    <Progress value={rec.matchScore} className="h-2" />
                  </div>

                  {rec.recommendedPrograms && rec.recommendedPrograms.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">Recommended Programs</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.recommendedPrograms.map((program, idx) => (
                          <span key={idx} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
