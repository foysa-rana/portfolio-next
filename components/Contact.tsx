'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface ContactInfo {
  email: string
  phone: string
  address: string
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact')
        if (!response.ok) {
          throw new Error('Failed to fetch contact info')
        }
        const data = await response.json()
        setContactInfo(data)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load contact info'
        toast({
          title: "Error",
          description: message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })
    setFormData({ name: '', email: '', message: '' })
    setSubmitting(false)
  }

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-2/3" />
                ))}
              </div>
            </div>
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              ))}
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Get in <span className="text-primary">Touch</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Let&apos;s Connect</h3>
            <p className="text-muted-foreground mb-6">
              I&apos;m always open to new opportunities and collaborations. Feel free to reach out!
            </p>
            <div className="space-y-4">
              {contactInfo?.email && (
                <div className="flex items-center">
                  <Mail className="mr-4 text-primary" size={24} />
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo?.phone && (
                <div className="flex items-center">
                  <Phone className="mr-4 text-primary" size={24} />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo?.address && (
                <div className="flex items-center">
                  <MapPin className="mr-4 text-primary" size={24} />
                  <span>{contactInfo.address}</span>
                </div>
              )}
            </div>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
              ></textarea>
            </div>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact

