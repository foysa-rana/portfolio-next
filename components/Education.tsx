'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin } from 'lucide-react'

const educationData = [
  {
    degree: "Master of Science in Software Engineering",
    institution: "ABC University",
    location: "New York, USA",
    year: "2020 - 2022",
    description: "Specialized in advanced software architecture, machine learning, and cloud computing. Completed a thesis on scalable microservices architecture."
  },
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of XYZ",
    location: "San Francisco, USA",
    year: "2015 - 2019",
    description: "Focused on software engineering, algorithms, and data structures. Participated in various coding competitions and hackathons."
  },
]

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
          {educationData.map((edu, index) => (
            <motion.div 
              key={index} 
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
                  {edu.year}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="text-primary" />
                  {edu.location}
                </span>
              </div>
              <p className="text-sm">{edu.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Education

