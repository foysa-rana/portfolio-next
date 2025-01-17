import Link from 'next/link'
import { Github, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-background py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">&copy; 2023 Foysal Rana. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="https://github.com/foysalrana" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={24} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://linkedin.com/in/foysalrana" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={24} />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://twitter.com/foysalrana" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter size={24} />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

