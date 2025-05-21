"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.subject.trim() || !formData.message.trim()) {
        throw new Error("Please fill in all fields")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form
      setFormData({
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject" className="dark:text-white">
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          placeholder="What do you need help with?"
          value={formData.subject}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="dark:text-white">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Describe your issue in detail"
          value={formData.message}
          onChange={handleChange}
          className="min-h-[150px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <Button
        type="submit"
        className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
