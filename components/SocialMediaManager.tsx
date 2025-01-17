'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react'

interface SocialMedia {
  id: number
  platform: string
  url: string
}

export default function SocialMediaManager() {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([
    { id: 1, platform: 'GitHub', url: 'https://github.com/foysalrana' },
    { id: 2, platform: 'LinkedIn', url: 'https://linkedin.com/in/foysalrana' },
    { id: 3, platform: 'Twitter', url: 'https://twitter.com/foysalrana' }
  ])
  const [newSocialMedia, setNewSocialMedia] = useState<SocialMedia>({
    id: 0,
    platform: '',
    url: ''
  })

  const addSocialMedia = () => {
    if (newSocialMedia.platform && newSocialMedia.url) {
      setSocialMedias([...socialMedias, { ...newSocialMedia, id: Date.now() }])
      setNewSocialMedia({
        id: 0,
        platform: '',
        url: ''
      })
    }
  }

  const removeSocialMedia = (id: number) => {
    setSocialMedias(socialMedias.filter(sm => sm.id !== id))
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
        <Button onClick={addSocialMedia}>Add Social Media</Button>
        <div className="space-y-2">
          {socialMedias.map(sm => (
            <div key={sm.id} className="flex items-center justify-between bg-secondary p-3 rounded-md">
              <div className="flex items-center space-x-2">
                {getIcon(sm.platform)}
                <span>{sm.platform}</span>
              </div>
              <div className="flex items-center space-x-2">
                <a href={sm.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                  View Profile
                </a>
                <Button variant="destructive" size="sm" onClick={() => removeSocialMedia(sm.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => console.log('Saving social media:', socialMedias)}>
          Save Social Media
        </Button>
      </CardFooter>
    </Card>
  )
}

