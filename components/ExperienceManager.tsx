'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle, Pencil, Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "@/styles/datepicker.css"
import ExperienceManagerSkeleton from './skeletons/ExperienceManagerSkeleton'

interface Experience {
  _id?: string
  title: string
  company: string
  startDate: string
  endDate: string
  location: string
  responsibilities: string[]
}

// Add custom styles for the datepicker
const datePickerWrapperStyles = "w-full"
const datePickerStyles = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
const calendarIconStyles = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"

// Add custom styles for the datepicker popup
const customDatePickerStyles = {
  datePickerContainer: "!w-full",
  monthYearPicker: "!bg-background !border-border !min-w-[280px]",
  monthYearDropdown: "!bg-background !text-foreground",
  monthYearOption: "!text-foreground hover:!bg-accent",
  selectedMonth: "!bg-primary !text-primary-foreground",
  currentMonth: "!text-primary"
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string>("")
  const [loadingId, setLoadingId] = useState<string>("")
  const emptyExperience: Experience = {
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    responsibilities: ['']
  }
  const [newExperience, setNewExperience] = useState<Experience>(emptyExperience)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  useEffect(() => {
    if (newExperience.startDate) {
      setStartDate(new Date(newExperience.startDate))
    }
    if (newExperience.endDate) {
      setEndDate(new Date(newExperience.endDate))
    }
  }, [newExperience.startDate, newExperience.endDate])

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date)
      setNewExperience({
        ...newExperience,
        startDate: date.toISOString().split('T')[0]
      })
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date)
      setNewExperience({
        ...newExperience,
        endDate: date.toISOString().split('T')[0]
      })
    } else {
      setEndDate(null)
      setNewExperience({
        ...newExperience,
        endDate: ''
      })
    }
  }

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch experiences')
      }
      setExperiences(data)
    } catch {
      toast.error('Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (experience: Experience) => {
    setNewExperience(experience)
    setIsEditing(true)
    setAccordionValue("add-experience")
  }

  const cancelEditing = () => {
    setNewExperience(emptyExperience)
    setIsEditing(false)
    setAccordionValue("")
  }

  const updateExperience = async () => {
    if (newExperience.title && newExperience.company) {
      try {
        const filteredResponsibilities = newExperience.responsibilities.filter(resp => resp.trim() !== '')
        if (filteredResponsibilities.length === 0) {
          toast.error('Please add at least one responsibility')
          return
        }

        const experienceData = { ...newExperience, responsibilities: filteredResponsibilities }
        const response = await fetch(`/api/experiences/${newExperience._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(experienceData),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to update experience')
        }

        setExperiences(experiences.map(exp => 
          exp._id === newExperience._id ? data : exp
        ))
        setNewExperience(emptyExperience)
        setIsEditing(false)
        setAccordionValue("")
        toast.success('Experience updated successfully')
      } catch {
        toast.error('Failed to update experience')
      }
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const addExperience = async () => {
    if (newExperience.title && newExperience.company) {
      try {
        // Filter out empty responsibilities
        const filteredResponsibilities = newExperience.responsibilities.filter(resp => resp.trim() !== '')
        if (filteredResponsibilities.length === 0) {
          toast.error('Please add at least one responsibility')
          return
        }

        const experienceData = { ...newExperience, responsibilities: filteredResponsibilities }
        const response = await fetch('/api/experiences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(experienceData),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create experience')
        }

        setExperiences([data, ...experiences])
        setNewExperience({
          title: '',
          company: '',
          startDate: '',
          endDate: '',
          location: '',
          responsibilities: ['']
        })
        toast.success('Experience added successfully')
      } catch {
        toast.error('Failed to add experience')
      }
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const addResponsibility = () => {
    setNewExperience({
      ...newExperience,
      responsibilities: [...newExperience.responsibilities, '']
    })
  }

  const updateResponsibility = (index: number, value: string) => {
    const updatedResponsibilities = [...newExperience.responsibilities]
    updatedResponsibilities[index] = value
    setNewExperience({
      ...newExperience,
      responsibilities: updatedResponsibilities
    })
  }

  const removeResponsibility = (index: number) => {
    if (newExperience.responsibilities.length > 1) {
      const updatedResponsibilities = newExperience.responsibilities.filter((_, i) => i !== index)
      setNewExperience({
        ...newExperience,
        responsibilities: updatedResponsibilities
      })
    }
  }

  const removeExperience = async (id: string) => {
    setLoadingId(id)
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete experience')
      }

      setExperiences(experiences.filter(exp => exp._id !== id))
      toast.success('Experience removed successfully')
    } catch {
      toast.error('Failed to remove experience')
    } finally {
      setLoadingId("")
    }
  }

  if (loading) {
    return <ExperienceManagerSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <AccordionItem value="add-experience">
            <AccordionTrigger>
              <div className="flex items-center">
                {isEditing ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2" />}
                {isEditing ? 'Edit Experience' : 'Add New Experience'}
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      placeholder="Company"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className={`relative ${datePickerWrapperStyles}`}>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        showFourColumnMonthYearPicker
                        placeholderText="Select Start Date"
                        disabled={isSubmitting}
                        className={datePickerStyles}
                        calendarClassName="datepicker-custom"
                        wrapperClassName={customDatePickerStyles.datePickerContainer}
                        popperClassName="react-datepicker-popper"
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
                      />
                      <CalendarIcon className={calendarIconStyles} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className={`relative ${datePickerWrapperStyles}`}>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        showFourColumnMonthYearPicker
                        placeholderText="Select End Date"
                        isClearable
                        disabled={isSubmitting}
                        className={datePickerStyles}
                        calendarClassName="datepicker-custom"
                        wrapperClassName={customDatePickerStyles.datePickerContainer}
                        popperClassName="react-datepicker-popper"
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
                        minDate={startDate || new Date('1950-01-01')}
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 10))}
                      />
                      <CalendarIcon className={calendarIconStyles} />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                      placeholder="City, State"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Responsibilities</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addResponsibility}>
                      Add Responsibility
                    </Button>
                  </div>
                  {newExperience.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={responsibility}
                        onChange={(e) => updateResponsibility(index, e.target.value)}
                        placeholder={`Responsibility ${index + 1}`}
                      />
                      {newExperience.responsibilities.length > 1 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeResponsibility(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={updateExperience}>Update Experience</Button>
                      <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={addExperience}>Add Experience</Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          {experiences.map(exp => (
            <Card key={exp._id} className="bg-neutral-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { 
                        month: 'long',
                        year: 'numeric'
                      })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      }) : 'Present'}
                    </p>
                    <p className="text-sm text-muted-foreground">{exp.location}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEditing(exp)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="list-disc list-inside mt-4 space-y-1">
                  {exp.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="text-sm">{responsibility}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={() => removeExperience(exp._id!)}
                  disabled={loadingId === exp._id}
                >
                  {loadingId === exp._id ? (
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

