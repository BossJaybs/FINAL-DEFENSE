"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { isUserAdmin } from "@/app/actions/admin-actions"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { signOut } from "@/lib/auth"

export function UserNav() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const { user } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileName, setProfileName] = useState({
    firstName: "John",
    lastName: "Doe",
  })

  const { toast } = useToast()

  const handleLogout = async () => {
    // Show loading toast
    toast({
      title: "Logging out...",
      description: "Please wait while we log you out.",
    })

    // Call the signOut function from auth.ts
    const { error } = await signOut()

    if (error) {
      // Show error toast if logout failed
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      })
    } else {
      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })

      // The signOut function already redirects to login page
      // No need to call router.push here
    }
  }

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await isUserAdmin(user.id)
        setIsAdmin(adminStatus)
      }
    }

    checkAdmin()
  }, [user])

  // Load profile data from localStorage
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const loadProfileData = () => {
        const savedImage = localStorage.getItem("profileImage")
        if (savedImage) {
          setProfileImage(savedImage)
        }

        const savedFirstName = localStorage.getItem("firstName")
        const savedLastName = localStorage.getItem("lastName")
        if (savedFirstName && savedLastName) {
          setProfileName({
            firstName: savedFirstName,
            lastName: savedLastName,
          })
        }
      }

      // Load immediately on mount
      loadProfileData()

      // Set up event listener for changes
      window.addEventListener("storage", loadProfileData)

      // Custom event listener for same-page updates
      const handleCustomStorageChange = () => {
        loadProfileData()
      }
      window.addEventListener("storage", handleCustomStorageChange)

      return () => {
        window.removeEventListener("storage", loadProfileData)
        window.removeEventListener("storage", handleCustomStorageChange)
      }
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {profileImage ? (
              <AvatarImage
                src={profileImage || "/placeholder.svg"}
                alt={`${profileName.firstName} ${profileName.lastName}`}
              />
            ) : (
              <AvatarImage src="/placeholder.svg" alt="@user" />
            )}
            <AvatarFallback>
              {profileName.firstName[0]}
              {profileName.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profileName.firstName} {profileName.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
