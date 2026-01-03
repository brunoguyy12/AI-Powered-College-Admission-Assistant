import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your AI-Powered College Admissions Guide
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Get personalized university recommendations, craft compelling
            statements of purpose, and navigate your college journey with AI
            assistance.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg">Start Your Journey</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 text-3xl">🎯</div>
            <h3 className="text-lg font-semibold">Smart Recommendations</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get AI-powered university recommendations based on your profile
              and goals.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 text-3xl">✍️</div>
            <h3 className="text-lg font-semibold">SOP Generator</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Craft compelling Statements of Purpose with AI assistance.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 text-3xl">💬</div>
            <h3 className="text-lg font-semibold">AI Chatbot</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get instant answers to your college admissions questions.
            </p>
          </div>
        </div>

        <div className="mt-20 rounded-lg border border-border bg-card p-8">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold">Create Profile</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your academic information and goals
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold">Get Recommendations</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI analyzes your profile and recommends universities
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold">Generate Essays</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create personalized statements of purpose
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage applications and stay organized
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
