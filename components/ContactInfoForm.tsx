'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

interface ContactInfo {
  email: string
  phone: string
  address: string
}

export default function ContactInfoForm() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact')
        if (!response.ok) {
          throw new Error('Failed to fetch contact info')
        }
        const data = await response.json()
        if (data) {
          setContactInfo(data)
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load contact info'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      })

      if (!response.ok) {
        throw new Error('Failed to update contact info')
      }

      const data = await response.json()
      setContactInfo(data)
      toast.success('Contact information updated successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update contact info'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
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
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Contact Info'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

