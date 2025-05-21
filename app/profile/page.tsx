"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Camera, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Learning enthusiast focused on web development and design.",
  })

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Learning enthusiast focused on web development and design.",
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    weeklySummary: true,
    goalReminders: true,
  })

  // Loading states
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [isNotificationSaving, setIsNotificationSaving] = useState(false)

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }

    const savedFirstName = localStorage.getItem("firstName")
    const savedLastName = localStorage.getItem("lastName")
    if (savedFirstName && savedLastName) {
      setFormData((prev) => ({
        ...prev,
        firstName: savedFirstName,
        lastName: savedLastName,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create a URL for the selected image
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setProfileImage(imageUrl)
      localStorage.setItem("profileImage", imageUrl)

      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSaveChanges = () => {
    // Save profile data to localStorage
    localStorage.setItem("firstName", formData.firstName)
    localStorage.setItem("lastName", formData.lastName)

    // Manually trigger a storage event for components on the same page
    window.dispatchEvent(new Event("storage"))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    // Navigate back to dashboard after a short delay to show the toast
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfileForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target
    setNotificationSettings((prev) => ({ ...prev, [id]: checked }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProfileSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsNotificationSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsNotificationSaving(false)
    }
  }

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/cookies here
    router.push("/register")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile information and how others see you on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer" onClick={handleProfileImageClick}>
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleProfileImageClick} className="text-sm">
                  Change Profile Picture
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Notification Settings</h3>
            <form className="space-y-6" onSubmit={handleNotificationSubmit}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive updates about your progress via email
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id="emailNotif"
                      checked={notificationSettings.emailNotif}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">Push Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications on your device</p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id="pushNotif"
                      checked={notificationSettings.pushNotif}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">Weekly Summary</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get a weekly report of your learning progress
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id="weeklySummary"
                      checked={notificationSettings.weeklySummary}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">Goal Reminders</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminded about upcoming goals and deadlines
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id="goalReminders"
                      checked={notificationSettings.goalReminders}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isNotificationSaving}
              >
                {isNotificationSaving ? "Saving..." : "Save Notification Settings"}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 dark:text-white">Account Settings</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="dark:text-white">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="dark:text-white">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="dark:text-white">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <Button className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700">
                  Update Password
                </Button>
              </form>
            </div>

            <div className="pt-6 border-t dark:border-gray-700">
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium dark:text-white">Delete Account</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>

                <div>
                  <h4 className="font-medium dark:text-white">Export Data</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Download all your learning data and history.
                  </p>
                  <Button variant="outline" className="dark:text-white dark:hover:bg-gray-700">
                    Export All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
