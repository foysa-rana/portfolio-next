'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle } from 'lucide-react'

interface Education {
  id: number
  degree: string
  institution: string
  year: string
  description: string
}

export default function EducationManager() {
  const [educations, setEducations] = useState<Education[]>([
    {
      id: 1,
      degree: 'Master of Science in Software Engineering',
      institution: 'Tech University',
      year: '2020',
      description: 'Focused on advanced software architecture and machine learning applications.'
    },
    {
      id: 2,
      degree: 'Bachelor of Science in Computer Science',
      institution: 'State University',
      year: '2018',
      description: 'Specialized in algorithms and data structures. Participated in various coding competitions.'
    }
  ])
  const [newEducation, setNewEducation] = useState<Education>({
    id: 0,
    degree: '',
    institution: '',
    year: '',
    description: ''
  })

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setEducations([{ ...newEducation, id: Date.now() }, ...educations])
      setNewEducation({
        id: 0,
        degree: '',
        institution: '',
        year: '',
        description: ''
      })
    }
  }

  const removeEducation = (id: number) => {
    setEducations(educations.filter(edu => edu.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="add-education">
            <AccordionTrigger>
              <div className="flex items-center">
                <PlusCircle className="mr-2" />
                Add New Education
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      placeholder="Degree"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      placeholder="Institution"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      placeholder="Year"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEducation.description}
                    onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                    placeholder="Education description"
                    rows={4}
                  />
                </div>
                <Button onClick={addEducation}>Add Education</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          {educations.map(edu => (
            <Card key={edu.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.year}</p>
                <p className="mt-2">{edu.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => removeEducation(edu.id)}>Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => console.log('Saving educations:', educations)}>
          Save Education
        </Button>
      </CardFooter>
    </Card>
  )
}

