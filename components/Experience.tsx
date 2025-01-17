'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

const experienceData = [
  {
    position: "Senior Software Engineer",
    company: "Tech Innovators Inc.",
    location: "San Francisco, CA",
    period: "Jan 2021 - Present",
    responsibilities: [
      "Lead a team of 5 developers in designing and implementing scalable web applications",
      "Architected and developed microservices using Node.js and Docker",
      "Improved system performance by 40% through code optimization and caching strategies"
    ]
  },
  {
    position: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    location: "New York, NY",
    period: "Mar 2018 - Dec 2020",
    responsibilities: [
      "Developed and maintained multiple client-facing web applications using React and Express.js",
      "Implemented RESTful APIs and integrated third-party services",
      "Collaborated with UX designers to implement responsive and accessible user interfaces"
    ]
  },
  {
    position: "Junior Web Developer",
    company: "StartUp Ventures",
    location: "Austin, TX",
    period: "Jun 2016 - Feb 2018",
    responsibilities: [
      "Assisted in the development of company's main product using JavaScript and PHP",
      "Participated in code reviews and contributed to improving development processes",
      "Gained experience in Agile methodologies and version control using Git"
    ]
  }
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

const Experience = () => {
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
          {experienceData.map((exp, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-card rounded-lg shadow-lg p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="text-primary" />
                {exp.position}
              </h3>
              <p className="text-lg text-muted-foreground mb-2">{exp.company}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={16} className="text-primary" />
                  {exp.period}
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

