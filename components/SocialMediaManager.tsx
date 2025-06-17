'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Twitter, Instagram, Facebook, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

interface SocialMedia {
  _id?: string
  platform: string
  url: string
  order?: number
}

export default function SocialMediaManager() {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([])
  const [newSocialMedia, setNewSocialMedia] = useState<SocialMedia>({
    platform: '',
    url: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSocialMedia()
  }, [])

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/social-media')
      if (!response.ok) {
        throw new Error('Failed to fetch social media')
      }
      const data = await response.json()
      setSocialMedias(data)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load social media'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const addSocialMedia = async () => {
    if (!newSocialMedia.platform || !newSocialMedia.url) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSocialMedia),
      })

      if (!response.ok) {
        throw new Error('Failed to add social media')
      }

      const data = await response.json()
      setSocialMedias([...socialMedias, data])
      setNewSocialMedia({
        platform: '',
        url: ''
      })
      toast.success('Social media added successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add social media'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const removeSocialMedia = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/social-media/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove social media')
      }

      setSocialMedias(socialMedias.filter(sm => sm._id !== id))
      toast.success('Social media removed successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to remove social media'
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github size={20} />
      case 'linkedin':
        return <Linkedin size={20} />
      case 'twitter':
        return <Twitter size={20} />
      case 'instagram':
        return <Instagram size={20} />
      case 'facebook':
        return <Facebook size={20} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={newSocialMedia.platform}
              onChange={(e) => setNewSocialMedia({ ...newSocialMedia, platform: e.target.value })}
              placeholder="Platform (e.g., GitHub, LinkedIn)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={newSocialMedia.url}
              onChange={(e) => setNewSocialMedia({ ...newSocialMedia, url: e.target.value })}
              placeholder="Profile URL"
            />
          </div>
        </div>
        <Button onClick={addSocialMedia} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Social Media'
          )}
        </Button>
        <div className="space-y-2">
          {socialMedias.map(sm => (
            <div key={sm._id} className="flex items-center justify-between bg-secondary p-3 rounded-md">
              <div className="flex items-center space-x-2">
                {getIcon(sm.platform)}
                <span>{sm.platform}</span>
              </div>
              <div className="flex items-center space-x-2">
                <a href={sm.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                  View Profile
                </a>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => sm._id && removeSocialMedia(sm._id)}
                  disabled={deletingId === sm._id}
                >
                  {deletingId === sm._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

