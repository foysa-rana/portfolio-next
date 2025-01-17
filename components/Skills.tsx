'use client'

import { motion } from 'framer-motion'
import { HashIcon as Html, CodepenIcon as Css3, CodepenIcon as Javascript, Hash, BackpackIcon as BootstrapIcon, Code2, CodepenIcon as ReactIcon, Database, ServerIcon } from 'lucide-react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const skills = [
  { name: "HTML", icon: <Html className="w-5 h-5" />, gradient: "linear-gradient(90deg, #FF6B6B, #FFD93D, #FF6B6B)" },
  { name: "CSS", icon: <Css3 className="w-5 h-5" />, gradient: "linear-gradient(90deg, #4ECDC4, #45B7D1, #4ECDC4)" },
  { name: "JavaScript", icon: <Javascript className="w-5 h-5" />, gradient: "linear-gradient(90deg, #FFD93D, #FF9A3C, #FFD93D)" },
  { name: "C#", icon: <Hash className="w-5 h-5" />, gradient: "linear-gradient(90deg, #6C5CE7, #A29BFE, #6C5CE7)" },
  { name: "Bootstrap", icon: <BootstrapIcon className="w-5 h-5" />, gradient: "linear-gradient(90deg, #7F00FF, #E100FF, #7F00FF)" },
  { name: "Tailwind", icon: <Code2 className="w-5 h-5" />, gradient: "linear-gradient(90deg, #00F5A0, #00D9F5, #00F5A0)" },
  { name: "React", icon: <ReactIcon className="w-5 h-5" />, gradient: "linear-gradient(90deg, #00B4DB, #0083B0, #00B4DB)" },
  { name: "asp.net", icon: <ServerIcon className="w-5 h-5" />, gradient: "linear-gradient(90deg, #F857A6, #FF5858, #F857A6)" },
  { name: "SQL", icon: <Database className="w-5 h-5" />, gradient: "linear-gradient(90deg, #5433FF, #20BDFF, #5433FF)" },
]

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

const Skills = () => {
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
          {skills.map((skill, index) => (
            <SkillItem
              key={index}
              variants={itemVariants}
              gradient={skill.gradient}
              className="rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 text-white">
                {skill.icon}
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

