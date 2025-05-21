"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Moon, Sun, Globe, HelpCircle, Shield } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage, type Language, type DateFormat } from "@/context/language-context"

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("appearance")
  const { toast } = useToast()

  // Use our language context
  const { language, setLanguage, dateFormat, setDateFormat, t, saveLanguageSettings } = useLanguage()

  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)

      setDarkMode(isDark)

      // Apply the theme class to the html element
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)

    if (checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value as Language)
  }

  // Handle date format change
  const handleDateFormatChange = (e) => {
    setDateFormat(e.target.value as DateFormat)
  }

  // Save language settings and show toast
  const handleSaveLanguageSettings = () => {
    saveLanguageSettings()

    toast({
      title: t.settings.savedSuccess,
      description: `Language: ${language}, Date Format: ${dateFormat === "mdy" ? "MM/DD/YYYY" : dateFormat === "dmy" ? "DD/MM/YYYY" : "YYYY/MM/DD"}`,
    })
  }

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t.settings.passwordsDoNotMatch || "Passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError(t.settings.passwordTooShort || "Password must be at least 8 characters")
      return
    }

    setIsUpdatingPassword(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the password update request to your backend
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordForm.currentPassword,
      //     newPassword: passwordForm.newPassword
      //   })
      // });

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Show success message
      toast({
        title: t.settings.passwordUpdatedTitle || "Password Updated",
        description: t.settings.passwordUpdatedDesc || "Your password has been successfully updated.",
      })
    } catch (error) {
      console.error("Failed to update password:", error)
      toast({
        title: t.settings.errorTitle || "Error",
        description: t.settings.passwordUpdateError || "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t.settings.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.settings.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 space-y-1">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                activeTab === "appearance" ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>{t.settings.appearanceNav}</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                activeTab === "notifications" ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>{t.settings.notificationsNav}</span>
            </button>
            <button
              onClick={() => setActiveTab("language")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                activeTab === "language" ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>{t.settings.languageNav}</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                activeTab === "security" ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>{t.settings.securityNav}</span>
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                activeTab === "help" ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>{t.settings.helpNav}</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="text-lg font-medium dark:text-white">{t.settings.appearanceTitle}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="dark:text-white">
                      {t.settings.darkModeLabel}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.darkModeDesc}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                    <Moon className="h-4 w-4 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size" className="dark:text-white">
                    {t.settings.fontSizeLabel}
                  </Label>
                  <select
                    id="font-size"
                    defaultValue="medium"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="small">{t.settings.fontSizeSmall}</option>
                    <option value="medium">{t.settings.fontSizeMedium}</option>
                    <option value="large">{t.settings.fontSizeLarge}</option>
                  </select>
                </div>
              </div>

              <Button className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700">
                {t.settings.saveAppearance}
              </Button>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4 dark:text-white">{t.settings.notificationsTitle}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">{t.settings.emailNotifLabel}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.emailNotifDesc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">{t.settings.pushNotifLabel}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.pushNotifDesc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">{t.settings.weeklyLabel}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.weeklyDesc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}

          {/* Language & Region Settings */}
          {activeTab === "language" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-6 dark:text-white">{t.settings.languageTitle}</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language" className="dark:text-white">
                    {t.settings.languageLabel}
                  </Label>
                  <select
                    id="language"
                    value={language}
                    onChange={handleLanguageChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat" className="dark:text-white">
                    {t.settings.dateFormatLabel}
                  </Label>
                  <select
                    id="dateFormat"
                    value={dateFormat}
                    onChange={handleDateFormatChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="mdy">MM/DD/YYYY</option>
                    <option value="dmy">DD/MM/YYYY</option>
                    <option value="ymd">YYYY/MM/DD</option>
                  </select>
                </div>

                <Button
                  className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={handleSaveLanguageSettings}
                >
                  {t.settings.saveLanguage}
                </Button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4 dark:text-white">{t.settings.securityTitle}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 dark:text-white">{t.settings.changePasswordTitle}</h4>
                  <form className="space-y-4" onSubmit={(e) => handleUpdatePassword(e)}>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="dark:text-white">
                        {t.settings.currentPasswordLabel}
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="dark:text-white">
                        {t.settings.newPasswordLabel}
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="dark:text-white">
                        {t.settings.confirmPasswordLabel}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                      />
                      {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? "Updating..." : t.settings.updatePasswordButton}
                    </Button>
                  </form>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 dark:text-white">{t.settings.twoFactorTitle}</h4>
                  <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">{t.settings.twoFactorDesc}</p>
                  <Button variant="outline" className="dark:text-white dark:hover:bg-gray-700">
                    {t.settings.enable2FAButton}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Help & Support */}
          {activeTab === "help" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4 dark:text-white">{t.settings.helpTitle}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium dark:text-white">{t.settings.faqTitle}</h4>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">{t.settings.faqQuestion1}</AccordionTrigger>
                      <AccordionContent>
                        {t.settings.faqAnswer1}:
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>View your dashboard for an overview of your learning activities</li>
                          <li>Check your progress charts for detailed analytics</li>
                          <li>Monitor your goal completion rates</li>
                          <li>Review your activity history</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">{t.settings.faqQuestion2}</AccordionTrigger>
                      <AccordionContent>
                        {t.settings.faqAnswer2}:
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>Go to the Goals section</li>
                          <li>Click "Add New Goal"</li>
                          <li>Fill in the goal details (title, description, deadline)</li>
                          <li>Add milestones to break down your goal</li>
                          <li>Set the priority level</li>
                          <li>Click "Create Goal" to save</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium dark:text-white">{t.settings.contactTitle}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.contactDesc}</p>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      toast({
                        title: t.settings.messageSentTitle,
                        description: t.settings.messageSentDesc,
                      })
                      // Reset form
                      ;(e.target as HTMLFormElement).reset()
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="dark:text-white">
                        {t.settings.subjectLabel}
                      </Label>
                      <Input
                        id="subject"
                        placeholder={t.settings.subjectPlaceholder}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="dark:text-white">
                        {t.settings.messageLabel}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t.settings.messagePlaceholder}
                        className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>

                    <Button className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700">
                      {t.settings.sendMessageButton}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
