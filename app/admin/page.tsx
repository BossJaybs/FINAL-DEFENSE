"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Users, BookOpen, BarChart2, Trash2, Plus, Edit, Save, X, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getUsers,
  getUserProgress,
  getLearningMaterials,
  createLearningMaterial,
  deleteLearningMaterial,
  deleteUser,
  updateLearningMaterial,
  updateUserProgress,
} from "@/app/actions/admin-actions"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([])
  const [progress, setProgress] = useState([])
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMaterial, setEditingMaterial] = useState<any>(null)
  const [editingProgress, setEditingProgress] = useState<any>(null)
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    difficulty: "beginner",
  })
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })
  const [isAddingUser, setIsAddingUser] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true"
    if (!isAdmin) {
      router.push("/login")
    } else {
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [usersRes, progressRes, materialsRes] = await Promise.all([
        getUsers(),
        getUserProgress(),
        getLearningMaterials(),
      ])

      if (usersRes.error) throw new Error(usersRes.error.message)
      if (progressRes.error) throw new Error(progressRes.error.message)
      if (materialsRes.error) throw new Error(materialsRes.error.message)

      setUsers(usersRes.users || [])
      setProgress(progressRes.progress || [])
      setMaterials(materialsRes.materials || [])
    } catch (error: any) {
      console.error("Error fetching admin data:", error)
      setError(error.message || "Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { success, error } = await createLearningMaterial(newMaterial)
      if (!success || error) {
        throw error || new Error("Failed to create learning material")
      }

      // Reset form and refresh data
      setNewMaterial({
        title: "",
        description: "",
        content: "",
        category: "",
        difficulty: "beginner",
      })
      fetchData()
    } catch (error: any) {
      console.error("Error creating material:", error)
      setError(error.message || "Failed to create learning material")
    }
  }

  const handleUpdateMaterial = async () => {
    if (!editingMaterial) return

    try {
      const { success, error } = await updateLearningMaterial(editingMaterial.id, editingMaterial)
      if (!success || error) {
        throw error || new Error("Failed to update learning material")
      }

      setEditingMaterial(null)
      fetchData()
    } catch (error: any) {
      console.error("Error updating material:", error)
      setError(error.message || "Failed to update learning material")
    }
  }

  const handleUpdateProgress = async () => {
    if (!editingProgress) return

    try {
      const { success, error } = await updateUserProgress(editingProgress.id, {
        progress: Number.parseInt(editingProgress.progress),
        completed: editingProgress.completed,
      })
      if (!success || error) {
        throw error || new Error("Failed to update progress")
      }

      setEditingProgress(null)
      fetchData()
    } catch (error: any) {
      console.error("Error updating progress:", error)
      setError(error.message || "Failed to update progress")
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    try {
      const { success, error } = await deleteLearningMaterial(id)
      if (!success || error) {
        throw error || new Error("Failed to delete learning material")
      }
      fetchData()
    } catch (error: any) {
      console.error("Error deleting material:", error)
      setError(error.message || "Failed to delete learning material")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const { success, error } = await deleteUser(userId)
      if (!success || error) {
        throw error || new Error("Failed to delete user")
      }
      fetchData()
    } catch (error: any) {
      console.error("Error deleting user:", error)
      setError(error.message || "Failed to delete user")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Materials</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">Available learning resources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Entries</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.length}</div>
            <p className="text-xs text-muted-foreground">User progress records</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Progress Tracking
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts in the system.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account in the system.</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newUser.firstName}
                          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newUser.lastName}
                          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                  </form>
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingUser}>
                      {isAddingUser ? "Adding..." : "Add User"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user: any) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center gap-2 justify-end">
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.user_id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor user progress on learning materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {progress.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            No progress data found
                          </td>
                        </tr>
                      ) : (
                        progress.map((item: any) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.profiles?.first_name} {item.profiles?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{item.profiles?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.learning_materials?.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingProgress && editingProgress.id === item.id ? (
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editingProgress.progress}
                                  onChange={(e) => setEditingProgress({ ...editingProgress, progress: e.target.value })}
                                  className="w-20"
                                />
                              ) : (
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div
                                      className="bg-blue-600 h-2.5 rounded-full"
                                      style={{ width: `${item.progress}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500">{item.progress}%</div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingProgress && editingProgress.id === item.id ? (
                                <select
                                  value={editingProgress.completed ? "true" : "false"}
                                  onChange={(e) =>
                                    setEditingProgress({ ...editingProgress, completed: e.target.value === "true" })
                                  }
                                  className="border rounded p-1"
                                >
                                  <option value="true">Completed</option>
                                  <option value="false">In Progress</option>
                                </select>
                              ) : (
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {item.completed ? "Completed" : "In Progress"}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingProgress && editingProgress.id === item.id ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUpdateProgress}
                                    className="flex items-center gap-1"
                                  >
                                    <Save className="h-3 w-3" />
                                    Save
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingProgress(null)}
                                    className="flex items-center gap-1"
                                  >
                                    <X className="h-3 w-3" />
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingProgress(item)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Create and manage learning materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <form onSubmit={handleCreateMaterial} className="space-y-4 border-b pb-6">
                  <h3 className="text-lg font-medium">Add New Learning Material</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newMaterial.category}
                        onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newMaterial.content}
                      onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                      id="difficulty"
                      value={newMaterial.difficulty}
                      onChange={(e) => setNewMaterial({ ...newMaterial, difficulty: e.target.value })}
                      className="w-full rounded-md border border-gray-300 p-2"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <Button type="submit" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Material
                  </Button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Existing Materials</h3>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {materials.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                              No materials found
                            </td>
                          </tr>
                        ) : (
                          materials.map((material: any) => (
                            <tr key={material.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingMaterial && editingMaterial.id === material.id ? (
                                  <Input
                                    value={editingMaterial.title}
                                    onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                                  />
                                ) : (
                                  <div className="text-sm font-medium text-gray-900">{material.title}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingMaterial && editingMaterial.id === material.id ? (
                                  <Input
                                    value={editingMaterial.category}
                                    onChange={(e) =>
                                      setEditingMaterial({ ...editingMaterial, category: e.target.value })
                                    }
                                  />
                                ) : (
                                  <div className="text-sm text-gray-500">{material.category}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingMaterial && editingMaterial.id === material.id ? (
                                  <select
                                    value={editingMaterial.difficulty}
                                    onChange={(e) =>
                                      setEditingMaterial({ ...editingMaterial, difficulty: e.target.value })
                                    }
                                    className="border rounded p-1"
                                  >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                  </select>
                                ) : (
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      material.difficulty === "beginner"
                                        ? "bg-green-100 text-green-800"
                                        : material.difficulty === "intermediate"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {material.difficulty.charAt(0).toUpperCase() + material.difficulty.slice(1)}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingMaterial && editingMaterial.id === material.id ? (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={handleUpdateMaterial}
                                      className="flex items-center gap-1"
                                    >
                                      <Save className="h-3 w-3" />
                                      Save
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingMaterial(null)}
                                      className="flex items-center gap-1"
                                    >
                                      <X className="h-3 w-3" />
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingMaterial(material)}
                                      className="flex items-center gap-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteMaterial(material.id)}
                                      className="flex items-center gap-1"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Delete
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
