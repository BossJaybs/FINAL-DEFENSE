"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { getUserProgress } from "@/app/actions/admin-actions"
import { useToast } from "@/components/ui/use-toast"

export function ProgressTracking() {
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadProgress() {
      setLoading(true)
      const { progress, error } = await getUserProgress()
      if (error) {
        toast({
          title: "Error loading progress data",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setProgress(progress)
      }
      setLoading(false)
    }

    loadProgress()
  }, [toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>Monitor user progress on learning materials</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progress.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No progress data found
                  </TableCell>
                </TableRow>
              ) : (
                progress.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.profiles?.first_name} {item.profiles?.last_name}
                    </TableCell>
                    <TableCell>{item.learning_materials?.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="h-2 w-[100px]" />
                        <span className="text-xs">{item.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.completed ? (
                        <Badge variant="success">Completed</Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(item.started_at).toLocaleDateString()}</TableCell>
                    <TableCell>{item.completed_at ? new Date(item.completed_at).toLocaleDateString() : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
