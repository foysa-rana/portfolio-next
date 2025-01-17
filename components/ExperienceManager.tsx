'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle } from 'lucide-react'

interface Experience {
  id: number
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Innovators Inc.',
      startDate: '2021-01-01',
      endDate: '2023-12-31',
      description: 'Led a team of developers in designing and implementing scalable web applications. Improved system performance by 40% through code optimization.'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      startDate: '2018-03-01',
      endDate: '2020-12-31',
      description: 'Developed and maintained multiple client-facing web applications using React and Express.js. Implemented RESTful APIs and integrated third-party services.'
    }
  ])
  const [newExperience, setNewExperience] = useState<Experience>({
    id: 0,
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperiences([{ ...newExperience, id: Date.now() }, ...experiences])
      setNewExperience({
        id: 0,
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      })
    }
  }

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="add-experience">
            <AccordionTrigger>
              <div className="flex items-center">
                <PlusCircle className="mr-2" />
                Add New Experience
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                      placeholder="Job Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      placeholder="Company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newExperience.endDate}
                      onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    placeholder="Job description"
                    rows={4}
                  />
                </div>
                <Button onClick={addExperience}>Add Experience</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          {experiences.map(exp => (
            <Card key={exp.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </p>
                <p className="mt-2">{exp.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => removeExperience(exp.id)}>Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => console.log('Saving experiences:', experiences)}>
          Save Experiences
        </Button>
      </CardFooter>
    </Card>
  )
}

