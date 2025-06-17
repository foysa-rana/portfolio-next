'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Code2 } from 'lucide-react'

interface Skill {
  _id: string
  name: string
  icon: string | null
  order: number
}

const gradientAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

const SkillItem = styled(motion.div)<{ gradient: string }>`
  background: ${props => props.gradient};
  background-size: 200% 100%;
  animation: ${gradientAnimation} 15s linear infinite;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}

// Function to generate a gradient based on the skill name
const getGradient = (name: string) => {
  const colors = [
    ['#FF6B6B', '#FFD93D'],
    ['#4ECDC4', '#45B7D1'],
    ['#FFD93D', '#FF9A3C'],
    ['#6C5CE7', '#A29BFE'],
    ['#7F00FF', '#E100FF'],
    ['#00F5A0', '#00D9F5'],
    ['#00B4DB', '#0083B0'],
    ['#F857A6', '#FF5858'],
    ['#5433FF', '#20BDFF'],
  ]
  
  // Use the skill name to deterministically choose a gradient
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const [color1, color2] = colors[index]
  return `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        if (!response.ok) {
          throw new Error('Failed to fetch skills')
        }
        const data = await response.json()
        // Ensure data is an array and sort by order
        const skillsArray = Array.isArray(data) ? data : []
        setSkills(skillsArray.sort((a, b) => a.order - b.order))
      } catch (error) {
        console.error('Failed to fetch skills:', error)
        setSkills([])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (loading || skills.length === 0) {
    return null // Or you could return a loading skeleton here
  }

  return (
    <section id="skills" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">My Skills</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {skills.map((skill) => (
            <SkillItem
              key={skill._id}
              variants={itemVariants}
              gradient={getGradient(skill.name)}
              className="rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 text-white">
                {skill.icon ? (
                  <Image src={skill.icon} alt={skill.name} width={20} height={20} className="w-5 h-5" />
                ) : (
                  <Code2 className="w-5 h-5" />
                )}
                <span className="font-medium">{skill.name}</span>
              </div>
            </SkillItem>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills

