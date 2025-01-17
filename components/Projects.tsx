'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with React and Node.js",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Task Management App",
    description: "A React-based task management application with drag-and-drop functionality",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["React", "Redux", "Firebase"],
  },
  {
    title: "Weather Forecast App",
    description: "A weather forecast application using OpenWeatherMap API",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["React", "API Integration", "Geolocation"],
  },
]

const Projects = () => {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              layoutId={`project-${index}`}
              onClick={() => setSelectedId(index)}
              className="cursor-pointer"
            >
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`project-${selectedId}`}
              className="bg-card p-8 rounded-lg max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={projects[selectedId].image}
                alt={projects[selectedId].title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">{projects[selectedId].title}</h3>
              <p className="text-muted-foreground mb-4">{projects[selectedId].description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {projects[selectedId].tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={projects[selectedId].link}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View Project <ArrowRight className="ml-2" size={16} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects

