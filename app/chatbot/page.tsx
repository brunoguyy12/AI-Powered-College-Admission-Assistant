import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/require-auth";
import { ChatClient } from "@/components/chat-client";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function ChatbotPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />
      <BreadcrumbNav />
      <ChatClient />
    </div>
  );
}
