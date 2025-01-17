'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from 'lucide-react'

interface Skill {
  id: number
  name: string
  icon: string | null
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'React', icon: null },
    { id: 2, name: 'Next.js', icon: null },
    { id: 3, name: 'TypeScript', icon: null },
    { id: 4, name: 'Tailwind CSS', icon: null },
    { id: 5, name: 'Node.js', icon: null },
  ])
  const [newSkill, setNewSkill] = useState('')
  const [newIcon, setNewIcon] = useState<File | null>(null)

  const addSkill = () => {
    if (newSkill.trim()) {
      const iconUrl = newIcon ? URL.createObjectURL(newIcon) : null
      setSkills([...skills, { id: Date.now(), name: newSkill.trim(), icon: iconUrl }])
      setNewSkill('')
      setNewIcon(null)
    }
  }

  const removeSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewIcon(e.target.files[0])
    }
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
        <Button onClick={addSkill}>Add Skill</Button>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map(skill => (
            <Badge key={skill.id} variant="secondary" className="text-sm py-2 px-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {skill.icon && (
                  <img src={skill.icon} alt={skill.name} className="w-5 h-5" />
                )}
                <span>{skill.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => removeSkill(skill.id)}
              >
                <X size={14} />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => console.log('Saving skills:', skills)}>
          Save Skills
        </Button>
      </CardFooter>
    </Card>
  )
}

