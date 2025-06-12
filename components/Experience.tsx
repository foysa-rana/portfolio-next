'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Experience {
  _id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  responsibilities: string[]
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

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch experiences')
        }
        setExperiences(data)
      } catch (error) {
        console.error('Failed to load experiences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Professional Experience</h2>
          <div className="space-y-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-card rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-[90%]"></div>
                  <div className="h-3 bg-muted rounded w-[85%]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Professional Experience</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {experiences.map((exp) => (
            <motion.div 
              key={exp._id} 
              variants={itemVariants}
              className="bg-card rounded-lg shadow-lg p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="text-primary" />
                {exp.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-2">{exp.company}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={16} className="text-primary" />
                  {new Date(exp.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  }) : 'Present'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="text-primary" />
                  {exp.location}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2">
                {exp.responsibilities.map((responsibility, idx) => (
                  <li key={idx} className="text-sm">{responsibility}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Experience

