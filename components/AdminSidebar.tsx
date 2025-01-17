'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Briefcase, GraduationCap, Folder, Share2, Mail, Wrench } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'About Me', icon: User },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/projects', label: 'Projects', icon: Folder },
  { href: '/admin/social', label: 'Social Media', icon: Share2 },
  { href: '/admin/contact', label: 'Contact', icon: Mail },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card text-card-foreground p-4 border-r border-border">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

