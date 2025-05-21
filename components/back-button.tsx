"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function BackButton() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleBack = () => {
    // Instead of using router.back() which might not work as expected
    // Let's navigate directly to the dashboard
    router.push("/dashboard")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900"
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      {t.common.back}
    </Button>
  )
}
