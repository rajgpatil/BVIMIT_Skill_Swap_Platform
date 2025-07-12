import { getUser } from "@/lib/auth/server" // Updated import
import SkillDetailPageClient from "./SkillDetailPageClient"

export default async function SkillDetailPage() {
  const user = await getUser()

  // Optional: Redirect if user is not logged in and this page requires auth
  // if (!user) {
  //   redirect('/login')
  // }

  return <SkillDetailPageClient />
}
