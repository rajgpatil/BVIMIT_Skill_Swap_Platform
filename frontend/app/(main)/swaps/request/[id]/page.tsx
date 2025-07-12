import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/server" // Updated import
import RequestSwapPageClient from "./RequestSwapPageClient"

export default async function RequestSwapPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return <RequestSwapPageClient />
}
