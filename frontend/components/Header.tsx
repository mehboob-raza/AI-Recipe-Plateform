import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Cookie, Refrigerator, Sparkles } from 'lucide-react'
import UserDropdown from './UserDropdown'
import { checkUser } from '@/lib/checkUser'
import PricingModal from './PricingModal'
import { Badge } from './ui/badge'

const Header = async () => {
  const user = await checkUser()

  console.log('user', user);

  return (
    <header className="fixed top-0 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md supports-backdrop-filter:bg-stone-50">
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href={user ? '/dashboard' : '/'}>
          <Image src='/logo.png' alt='ai recipe logo' width={60} height={60} className='w-16' />
        </Link>
        <div className='hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600 '>
          <Link href='/recipes'
            className='hover:text-orange-600 transition flex gap-1.5 items-center'
          >
            <Cookie className='w-4 h-4' />
            My Recipes
          </Link>
          <Link href='/pantry'
            className='hover:text-orange-600 transition flex gap-1.5 items-center'
          >
            <Refrigerator className='w-4 h-4' />
            My Pantry
          </Link>

        </div>
        <div className='flex items-center justify-between'>

          <Show when="signed-in" >
            <div className='flex gap-2 items-center' >
              {
                user && <PricingModal subscriptionTier={user.subscriptionTier}>
                  <Badge variant='outline' className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${user.subscriptionTier === 'pro' ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
                    :
                    "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"} `}>
                    <Sparkles
                      className={`h-4 w-4 ${user.subscriptionTier === 'pro' ? "text-white fill-white/20" : "text-stone-500 "
                        } `}
                    />
                    <span>
                      {user.subscriptionTier === 'pro' ? 'Pro Chef' : 'Free Plan'}
                    </span>
                  </Badge>
                </PricingModal>
              }
              <UserDropdown />
            </div>
          </Show>
          <Show when="signed-out" >
            <SignInButton mode='modal'>
              <Button variant='ghost' className='text-stone-600 hover:text-orange-600 hover:bg-orange-50 font-medium cursor-pointer'>Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal" >
              <Button variant='primary' className="rounded-full px-6 py-6 cursor-pointer">
                Get Started
              </Button>
            </SignUpButton>
          </Show>
        </div>
      </nav>
    </header>
  )
}

export default Header