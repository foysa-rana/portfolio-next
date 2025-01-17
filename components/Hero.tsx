'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface AboutMeData {
  name: string;
  title: string;
  bio: string;
  pictureUrl: string;
}

const defaultData: AboutMeData = {
  name: "Foysal Rana",
  title: "Creative Developer",
  bio: "Hi, I'm Foysal Rana. A creative developer passionate about building innovative web solutions.",
  pictureUrl: "/hero.jpg"
}

const Hero = () => {
  const [aboutMe, setAboutMe] = useState<AboutMeData>(defaultData)

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await fetch('/api/about-me')
        const data = await response.json()

        if (data && data._id) {
          setAboutMe({
            name: data.name || defaultData.name,
            title: data.title || defaultData.title,
            bio: data.bio || defaultData.bio,
            pictureUrl: data.pictureUrl || defaultData.pictureUrl
          })
        }
      } catch (error) {
        console.error('Failed to fetch about me data:', error)
      }
    }

    fetchAboutMe()
  }, [])

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-background dark:bg-gradient-to-b dark:from-background dark:to-background-end pt-16 md:pt-0">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {aboutMe.title.split(' ').map((word, index) => (
                <span key={index}>
                  {index === 0 ? word : <span className="text-primary">{word}</span>}{' '}
                </span>
              ))}
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-muted-foreground">
              {aboutMe.bio}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight className="ml-2" size={20} />
              </motion.a>
              <motion.button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
                <ArrowRight className="ml-2" size={20} />
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-8 md:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-20"></div>
            <Image
              src={aboutMe.pictureUrl.startsWith('http') ? aboutMe.pictureUrl : aboutMe.pictureUrl.startsWith('/') ? aboutMe.pictureUrl : `/${aboutMe.pictureUrl}`}
              alt={aboutMe.name}
              className="rounded-full relative z-10 w-full aspect-square object-cover mx-auto max-w-[500px]"
              width={500}
              height={500}
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

