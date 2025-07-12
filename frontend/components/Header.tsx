"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MenuIcon } from "lucide-react"
import { signOut } from "@/lib/auth/client" // Updated import
import { useActionState } from "react"
import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth/client" // Updated import
import type { User } from "@supabase/supabase-js"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [state, formAction] = useActionState(signOut, null)

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [state]) // Re-fetch user on sign out action completion

  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">SkillSwap</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/skills/browse" className="hover:underline underline-offset-4">
          Browse Skills
        </Link>
        <Link href="/people" className="hover:underline underline-offset-4">
          People
        </Link>
        <Link href="/swaps" className="hover:underline underline-offset-4">
          My Swaps
        </Link>
        <Link href="/profile" className="hover:underline underline-offset-4">
          Profile
        </Link>
        <Link href="/feedback" className="hover:underline underline-offset-4">
          Feedback
        </Link>
        <Link href="/analytics" className="hover:underline underline-offset-4">
          Analytics
        </Link>
        <Link href="/admin/dashboard" className="hover:underline underline-offset-4">
          Admin
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder-user.jpg"} />
                  <AvatarFallback>{user.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <form action={formAction}>
                  <Button type="submit" variant="ghost" className="w-full justify-start p-0 h-auto">
                    Logout
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
        <Button variant="outline" className="md:hidden bg-transparent" size="icon">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </div>
    </header>
  )
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
