'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Settings,
  Users,
  CreditCard,
  Link as LinkIcon,
  MessageSquare
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export default function Sidebar() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Profile',
      href: '/dashboard/profile',
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      title: 'Links',
      href: '/dashboard/links',
      icon: <LinkIcon className="h-5 w-5" />,
    },
    {
      title: 'Messages',
      href: '/dashboard/messages',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Clients',
      href: '/dashboard/clients',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Forms',
      href: '/dashboard/forms',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Payments',
      href: '/dashboard/payments',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center font-semibold">
          <span className="text-xl">ClientsideStory</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'hover:bg-black hover:bg-opacity-5'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-color, #6366f1)' : 'transparent',
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-sidebar-foreground/70">
          <p>© 2024 ClientsideStory</p>
        </div>
      </div>
    </div>
  )
}
