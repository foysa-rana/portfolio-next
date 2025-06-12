'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

interface Project {
  _id: string
  title: string
  description: string
  image: string
  link: string
  tags: string[]
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Omit<Project, '_id'>>({
    title: '',
    description: '',
    image: '',
    link: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load projects'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addProject = async () => {
    if (!newProject.title || !newProject.description || !imagePreview) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', newProject.title)
      formData.append('description', newProject.description)
      formData.append('link', newProject.link)
      formData.append('tags', JSON.stringify(newProject.tags))

      // Get the file from the input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = fileInput?.files?.[0]
      if (file) {
        formData.append('image', file)
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const project = await response.json()
      setProjects([project, ...projects])
      setNewProject({
        title: '',
        description: '',
        image: '',
        link: '',
        tags: []
      })
      setNewTag('')
      setImagePreview('')
      toast.success('Project created successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create project'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const removeProject = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects(projects.filter(project => project._id !== id))
      toast.success('Project deleted successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete project'
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  const addTag = () => {
    if (newTag && !newProject.tags.includes(newTag)) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, newTag]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter(tag => tag !== tagToRemove)
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-2" />
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 bg-gray-200 rounded-full w-16" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="add-project">
            <AccordionTrigger>
              <div className="flex items-center">
                <PlusCircle className="mr-2" />
                Add New Project
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">Project Link</Label>
                    <Input
                      id="link"
                      value={newProject.link}
                      onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                      placeholder="Project Link"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Project description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Project Image</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative w-full h-48">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview('')
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                    />
                    <Button onClick={addTag} type="button">Add Tag</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProject.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary hover:text-primary/80"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <Button onClick={addProject} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Project...
                    </>
                  ) : (
                    'Add Project'
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          {projects.map(project => (
            <Card key={project._id}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={project.image}
                    alt={project.title} 
                    className="w-24 h-24 object-cover rounded-md" 
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="underline">
                        View Project
                      </a>
                    </p>
                  </div>
                </div>
                <p className="mt-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={() => removeProject(project._id)}
                  disabled={deletingId === project._id}
                >
                  {deletingId === project._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

