'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaListUl } from 'react-icons/fa'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { RiLogoutCircleRLine, RiRobot2Line } from 'react-icons/ri'

const navItems = [
  { href: '/ai-chat', label: 'AIチャット', icon: RiRobot2Line },
  { href: '/politicians', label: '政治家一覧', icon: FaListUl },
  { href: '/support-resource', label: '支援リソース', icon: HiOutlineBookOpen },
  { href: '/logout', label: 'ログアウト', icon: RiLogoutCircleRLine },
] as const

const linkClass = 'flex items-center justify-center group space-x-1.5 text-m-gold font-bold transition-all duration-500'

export default function MemberHeader() {
  const pathname = usePathname()

  return (
    <div className='hidden md:flex items-center gap-6'>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} className={linkClass}>
            <Icon
              className={cn(
                'text-2xl transition-colors duration-300 group-hover:text-primary',
                isActive ? 'text-primary' : 'text-[#333]'
              )}
            />
            <span
              className={cn(
                'transition-colors duration-300 group-hover:text-primary',
                isActive ? 'text-primary' : 'text-[#333]'
              )}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
