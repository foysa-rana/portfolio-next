'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Education {
  _id: string
  degree: string
  institution: string
  location: string
  startYear: string
  endYear: string
  descriptions: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

const Education = () => {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      } finally {
        setLoading(false)
      }
    }

    fetchEducations()
  }, [])

  if (loading) {
    return (
      <section id="education" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Education</h2>
          <div className="space-y-8">
            {[1, 2].map((index) => (
              <div key={index} className="border-l-4 border-primary pl-6 relative animate-pulse">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-1"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-[90%]"></div>
                    <div className="h-3 bg-muted rounded w-[85%]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="education" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Education</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {educations.map((edu) => (
            <motion.div 
              key={edu._id} 
              variants={itemVariants}
              className="border-l-4 border-primary pl-6 relative"
            >
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-1"></div>
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="text-primary" />
                {edu.degree}
              </h3>
              <p className="text-lg text-muted-foreground mb-2">{edu.institution}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={16} className="text-primary" />
                  {edu.startYear} - {edu.endYear || 'Present'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="text-primary" />
                  {edu.location}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2">
                {edu.descriptions.map((description, idx) => (
                  <li key={idx} className="text-sm">{description}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Education

