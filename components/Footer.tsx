'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react'

interface SocialMedia {
  _id: string
  platform: string
  url: string
}

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch('/api/social-media')
        if (!response.ok) {
          throw new Error('Failed to fetch social media')
        }
        const data = await response.json()
        setSocialMedia(data)
      } catch (error) {
        console.error('Failed to load social media:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSocialMedia()
  }, [])

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github size={24} />
      case 'linkedin':
        return <Linkedin size={24} />
      case 'twitter':
        return <Twitter size={24} />
      case 'instagram':
        return <Instagram size={24} />
      case 'facebook':
        return <Facebook size={24} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <footer className="bg-background py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-64 mb-4 md:mb-0" />
            <div className="flex space-x-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-6 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-background py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} Foysal Rana. All rights reserved.</p>
          <div className="flex space-x-6">
            {socialMedia.map((social) => (
              <Link
                key={social._id}
                href={social.url}
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getIcon(social.platform)}
                <span className="sr-only">{social.platform}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

