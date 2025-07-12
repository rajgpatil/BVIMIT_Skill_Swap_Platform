import UserProfilePageClient from "./UserProfilePageClient"
import { getAllProfiles } from "@/lib/services/profile-service"

// This function tells Next.js which dynamic paths to pre-render at build time.
export async function generateStaticParams() {
  try {
    const profiles = await getAllProfiles()
    return profiles.map((profile) => ({
      id: profile.id,
    }))
  } catch (error) {
    console.error("Error generating static params for profiles:", error)
    return []
  }
}

export default function UserProfilePage() {
  return <UserProfilePageClient />
}
