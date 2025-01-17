'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  image: string
  link: string
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution built with React and Node.js.',
      image: '/placeholder.svg?height=200&width=300',
      link: 'https://example.com/ecommerce'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A React-based task management application with drag-and-drop functionality.',
      image: '/placeholder.svg?height=200&width=300',
      link: 'https://example.com/taskmanager'
    }
  ])
  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    title: '',
    description: '',
    image: '',
    link: ''
  })

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProjects([{ ...newProject, id: Date.now() }, ...projects])
      setNewProject({
        id: 0,
        title: '',
        description: '',
        image: '',
        link: ''
      })
    }
  }

  const removeProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
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
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    placeholder="Image URL"
                  />
                </div>
                <Button onClick={addProject}>Add Project</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          {projects.map(project => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <img src={project.image} alt={project.title} className="w-24 h-24 object-cover rounded-md" />
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
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => removeProject(project.id)}>Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => console.log('Saving projects:', projects)}>
          Save Projects
        </Button>
      </CardFooter>
    </Card>
  )
}

