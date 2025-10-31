import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/require-auth"
import { ChatClient } from "@/components/chat-client"

export default async function ChatbotPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">AdmitAI Chatbot</span>
          </div>
        </div>
      </nav>

      <ChatClient />
    </div>
  )
}
