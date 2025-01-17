'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactInfoForm() {
  const [email, setEmail] = useState('contact@foysalrana.com')
  const [phone, setPhone] = useState('+1 (123) 456-7890')
  const [address, setAddress] = useState('123 Web Dev Street, Silicon Valley, CA 94000')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updating Contact Info:', { email, phone, address })
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Update Contact Info</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

