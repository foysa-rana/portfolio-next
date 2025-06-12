'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useToast } from '@/hooks/use-toast'
import SkillsManagerSkeleton from './skeletons/SkillsManagerSkeleton'

interface Skill {
  _id: string
  name: string
  icon: string | null
  order: number
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [newIcon, setNewIcon] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      if (!response.ok) {
        throw new Error('Failed to fetch skills')
      }
      const data = await response.json()
      // Ensure data is an array and sort by order
      const skillsArray = Array.isArray(data) ? data : []
      setSkills(skillsArray.sort((a, b) => a.order - b.order))
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      })
      setSkills([]) // Ensure skills is an empty array on error
    } finally {
      setLoading(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill.trim()) return

    setIsSubmitting(true)
    try {
      let iconUrl = null
      if (newIcon) {
        // Convert SVG file to base64
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(newIcon)
        })
        iconUrl = base64
      }

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSkill.trim(), icon: iconUrl }),
      })

      if (!response.ok) throw new Error('Failed to add skill')

      const newSkillData = await response.json()
      setSkills(prevSkills => [...prevSkills, newSkillData])
      setNewSkill('')
      setNewIcon(null)
      toast({
        title: "Success",
        description: "Skill added successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete skill')

      setSkills(prevSkills => prevSkills.filter(skill => skill._id !== id))
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewIcon(e.target.files[0])
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(skills)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the order property for each skill
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }))

    // Optimistically update the UI
    setSkills(updatedItems)

    try {
      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems),
      })

      if (!response.ok) throw new Error('Failed to update order')
      
      // Update with the server response to ensure consistency
      const updatedSkills = await response.json()
      setSkills(updatedSkills)
    } catch {
      // Revert to the original order on error
      setSkills(skills)
      toast({
        title: "Error",
        description: "Failed to update skill order",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <SkillsManagerSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newSkill">New Skill</Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a new skill"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newIcon">Skill Icon (SVG)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="newIcon"
                type="file"
                accept=".svg"
                onChange={handleIconUpload}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('newIcon')?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Button onClick={addSkill} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Skill'}
        </Button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {skills.map((skill, index) => (
                  <Draggable key={skill._id} draggableId={skill._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Badge
                          variant="secondary"
                          className="text-sm py-2 px-3 flex items-center justify-between w-full"
                        >
                          <div className="flex items-center space-x-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {skill.icon && (
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                className="w-5 h-5"
                              />
                            )}
                            <span>{skill.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => removeSkill(skill._id)}
                          >
                            <X size={14} />
                          </Button>
                        </Badge>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

