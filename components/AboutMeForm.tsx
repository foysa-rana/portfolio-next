'use client'

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { aboutMeSchema, type AboutMeFormData } from '@/schemas/aboutMe.schema'
import { ZodError } from 'zod'

export default function AboutMeForm() {
  const { toast } = useToast()
  const [name, setName] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [picture, setPicture] = React.useState<File | null>(null)
  const [pictureUrl, setPictureUrl] = React.useState('/placeholder.svg')
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [isNewProfile, setIsNewProfile] = React.useState(false)

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await fetch('/api/about-me')
        const data = await response.json()

        if (data && data._id) {
          setName(data.name || '')
          setTitle(data.title || '')
          setBio(data.bio || '')
          setPictureUrl(data.pictureUrl || '/placeholder.svg')
          setIsNewProfile(false)
        } else {
          setIsNewProfile(true)
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch about me data"
        })
      } finally {
        setIsInitializing(false)
      }
    }

    fetchAboutMe()
  }, [toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Cleanup previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      // Create new preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setPicture(file)
    } else {
      setPreviewUrl(null)
      setPicture(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData: AboutMeFormData = {
        name,
        title,
        bio,
        picture: picture || undefined
      }

      // Validate form data
      try {
        aboutMeSchema.parse(formData)
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          // Get the first error message
          const errorMessage = validationError.errors[0]?.message || 'Validation failed'
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: errorMessage
          })
          setLoading(false)
          return
        }
        throw validationError
      }

      // Create FormData for file upload
      const submitFormData = new FormData()
      submitFormData.append('name', name)
      submitFormData.append('title', title)
      submitFormData.append('bio', bio)
      if (picture) {
        submitFormData.append('picture', picture)
      }

      const response = await fetch('/api/about-me', {
        method: isNewProfile ? 'POST' : 'PUT',
        body: submitFormData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || (isNewProfile ? 'Failed to create about me' : 'Failed to update about me'))
      }

      const updatedData = await response.json()
      setPictureUrl(updatedData.pictureUrl || '/placeholder.svg')
      setPreviewUrl(null) // Clear preview after successful upload
      
      if (isNewProfile) {
        setIsNewProfile(false)
      }

      toast({
        variant: "success",
        title: "Success",
        description: isNewProfile ? "Profile created successfully!" : "Profile updated successfully!"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile"
      })
    } finally {
      setLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNewProfile ? 'Create Profile' : 'Edit Profile'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={previewUrl || pictureUrl} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="picture">Profile Picture</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your professional title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              required
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? (isNewProfile ? 'Creating...' : 'Updating...') : (isNewProfile ? 'Create Profile' : 'Update Profile')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

