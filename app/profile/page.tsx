import type { Metadata } from "next"
import { ProfilePage } from "@/components/profile-page"

export const metadata: Metadata = {
  title: "Profile - FinTrack",
  description: "Manage your profile and account settings",
}

export default function Profile() {
  return <ProfilePage />
}

