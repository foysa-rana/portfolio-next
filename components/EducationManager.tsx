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
import EducationManagerSkeleton from './skeletons/EducationManagerSkeleton'

interface Education {
  _id?: string
  degree: string
  institution: string
  location: string
  startYear: string
  endYear: string
  descriptions: string[]
}

// Add custom styles for the datepicker
const datePickerWrapperStyles = "w-full"
const datePickerStyles = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
const calendarIconStyles = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"

// Add custom styles for the datepicker popup
const customDatePickerStyles = {
  datePickerContainer: "!w-full",
  yearPicker: "!bg-background !border-border !rounded-lg !shadow-lg !p-4 !min-w-[280px]",
  yearDropdown: "!bg-background !text-foreground",
  yearOption: "!text-foreground hover:!bg-accent !rounded !px-2 !py-1 !m-1",
  selectedYear: "!bg-primary !text-primary-foreground",
  currentYear: "!text-primary"
}

export default function EducationManager() {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string>("")
  const [loadingId, setLoadingId] = useState<string>("")
  const emptyEducation: Education = {
    degree: '',
    institution: '',
    location: '',
    startYear: '',
    endYear: '',
    descriptions: ['']
  }
  const [newEducation, setNewEducation] = useState<Education>(emptyEducation)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchEducations()
  }, [])

  useEffect(() => {
    if (newEducation.startYear) {
      setStartDate(new Date(newEducation.startYear))
    }
    if (newEducation.endYear) {
      setEndDate(new Date(newEducation.endYear))
    }
  }, [newEducation.startYear, newEducation.endYear])

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date)
      setNewEducation({
        ...newEducation,
        startYear: date.toLocaleDateString('en-US', { 
          month: 'long',
          year: 'numeric'
        })
      })
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date)
      setNewEducation({
        ...newEducation,
        endYear: date.toLocaleDateString('en-US', { 
          month: 'long',
          year: 'numeric'
        })
      })
    } else {
      setEndDate(null)
      setNewEducation({
        ...newEducation,
        endYear: ''
      })
    }
  }

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/educations')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch educations')
      }
      setEducations(data)
    } catch (error) {
      console.error('Failed to load educations:', error)
      toast.error('Failed to load educations')
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (education: Education) => {
    setNewEducation(education)
    setIsEditing(true)
    setAccordionValue("add-education")
  }

  const cancelEditing = () => {
    setNewEducation(emptyEducation)
    setIsEditing(false)
    setAccordionValue("")
  }

  const updateEducation = async () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.location || !newEducation.startYear) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const filteredDescriptions = newEducation.descriptions.filter(desc => desc.trim() !== '')
      if (filteredDescriptions.length === 0) {
        toast.error('Please add at least one description')
        return
      }

      const educationData = { 
        ...newEducation,
        descriptions: filteredDescriptions,
        endYear: newEducation.endYear || '' // Ensure endYear is never undefined
      }

      const response = await fetch(`/api/educations/${newEducation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(educationData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update education')
      }

      setEducations(educations.map(edu => 
        edu._id === newEducation._id ? data : edu
      ))
      setNewEducation(emptyEducation)
      setIsEditing(false)
      setAccordionValue("")
      toast.success('Education updated successfully')
    } catch (error) {
      console.error('Failed to update education:', error)
      toast.error('Failed to update education')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addEducation = async () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.location || !newEducation.startYear) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const filteredDescriptions = newEducation.descriptions.filter(desc => desc.trim() !== '')
      if (filteredDescriptions.length === 0) {
        toast.error('Please add at least one description')
        return
      }

      const educationData = {
        ...newEducation,
        descriptions: filteredDescriptions,
        endYear: newEducation.endYear || '' // Ensure endYear is never undefined
      }

      const response = await fetch('/api/educations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(educationData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create education')
      }

      setEducations([data, ...educations])
      setNewEducation(emptyEducation)
      toast.success('Education added successfully')
    } catch (error) {
      console.error('Failed to add education:', error)
      toast.error('Failed to add education')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addDescription = () => {
    setNewEducation({
      ...newEducation,
      descriptions: [...newEducation.descriptions, '']
    })
  }

  const updateDescription = (index: number, value: string) => {
    const updatedDescriptions = [...newEducation.descriptions]
    updatedDescriptions[index] = value
    setNewEducation({
      ...newEducation,
      descriptions: updatedDescriptions
    })
  }

  const removeDescription = (index: number) => {
    if (newEducation.descriptions.length > 1) {
      const updatedDescriptions = newEducation.descriptions.filter((_, i) => i !== index)
      setNewEducation({
        ...newEducation,
        descriptions: updatedDescriptions
      })
    }
  }

  const removeEducation = async (id: string) => {
    setLoadingId(id)
    try {
      const response = await fetch(`/api/educations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete education')
      }

      setEducations(educations.filter(edu => edu._id !== id))
      toast.success('Education removed successfully')
    } catch (error) {
      console.error('Failed to remove education:', error)
      toast.error('Failed to remove education')
    } finally {
      setLoadingId("")
    }
  }

  if (loading) {
    return <EducationManagerSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <AccordionItem value="add-education">
            <AccordionTrigger>
              <div className="flex items-center">
                {isEditing ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2" />}
                {isEditing ? 'Edit Education' : 'Add New Education'}
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      placeholder="Institution"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startYear">Start Year</Label>
                    <div className={`relative ${datePickerWrapperStyles}`}>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        showMonthYearPicker
                        dateFormat="MMMM yyyy"
                        yearItemNumber={9}
                        placeholderText="Select Month and Year"
                        disabled={isSubmitting}
                        className={datePickerStyles}
                        calendarClassName="datepicker-custom"
                        wrapperClassName={customDatePickerStyles.datePickerContainer}
                        popperClassName="react-datepicker-popper"
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
                        minDate={new Date('1950-01-01')}
                        maxDate={new Date()}
                      />
                      <CalendarIcon className={calendarIconStyles} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endYear">End Year</Label>
                    <div className={`relative ${datePickerWrapperStyles}`}>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        showMonthYearPicker
                        dateFormat="MMMM yyyy"
                        yearItemNumber={9}
                        placeholderText="Select Month and Year"
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
                      value={newEducation.location}
                      onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                      placeholder="City, State"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Descriptions</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addDescription}
                      disabled={isSubmitting}
                    >
                      Add Description
                    </Button>
                  </div>
                  {newEducation.descriptions.map((description, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        placeholder={`Description ${index + 1}`}
                        disabled={isSubmitting}
                      />
                      {newEducation.descriptions.length > 1 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeDescription(index)}
                          disabled={isSubmitting}
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
                      <Button 
                        onClick={updateEducation} 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Education'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={cancelEditing}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={addEducation}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Education'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          {educations.map(edu => (
            <Card key={edu._id} className="bg-neutral-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startYear} - {edu.endYear || 'Present'}
                    </p>
                    <p className="text-sm text-muted-foreground">{edu.location}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEditing(edu)}
                    disabled={isSubmitting}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="list-disc list-inside mt-4 space-y-1">
                  {edu.descriptions.map((description, idx) => (
                    <li key={idx} className="text-sm">{description}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={() => removeEducation(edu._id!)}
                  disabled={isSubmitting || loadingId === edu._id}
                >
                  {loadingId === edu._id ? (
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

