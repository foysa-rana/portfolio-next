'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'

interface Project {
  _id: string
  title: string
  description: string
  image: string
  link: string
  tags: string[]
}

const Projects = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        const data = await response.json()
        setProjects(data)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load projects'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full w-16" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              layoutId={`project-${project._id}`}
              onClick={() => setSelectedId(project._id)}
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
              {projects.find(p => p._id === selectedId) && (
                <>
                  <img
                    src={projects.find(p => p._id === selectedId)!.image}
                    alt={projects.find(p => p._id === selectedId)!.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-2xl font-semibold mb-2">
                    {projects.find(p => p._id === selectedId)!.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {projects.find(p => p._id === selectedId)!.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {projects.find(p => p._id === selectedId)!.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={projects.find(p => p._id === selectedId)!.link}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    View Project <ArrowRight className="ml-2" size={16} />
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects

