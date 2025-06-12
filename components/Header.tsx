'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Menu, Moon, Sun } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAdminPage = pathname.startsWith('/admin')

  const title = pathname.split('/').pop()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const menuItems = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ]

  const NavItems = ({ isMobile = false }) => (
    <>
      {menuItems.map((item) => (
        <motion.a
          key={item.href}
          href={item.href}
          className={`text-foreground hover:text-primary transition-colors ${isMobile ? 'block py-2' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          {item.label}
        </motion.a>
      ))}
    </>
  )

  return (
    <motion.header
      className={`sticky top-0 w-full z-50 transition-colors ${
        isScrolled ? 'bg-background/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className={`${isAdminPage ? '' : 'container'} mx-auto px-6 py-4 `}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.a
              href={isAdminPage ? '/admin' : '/'}
              className="text-2xl font-bold text-primary uppercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAdminPage ? 'Admin' : 'Foysal Rana'}
            </motion.a>
            {isAdminPage && (
              <h1 className="text-3xl font-bold ml-48 capitalize">{title === 'admin' ? 'About Me' : title}</h1>
            )}
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            {!isAdminPage && <NavItems />}
            {isMounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-primary/10 text-primary"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={24} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavItems isMobile />
                  {isMounted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark")
                        setIsMobileMenuOpen(false)
                      }}
                      className="justify-start"
                    >
                      {theme === "dark" ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                      {theme === "dark" ? "Light" : "Dark"} mode
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

export default Header

