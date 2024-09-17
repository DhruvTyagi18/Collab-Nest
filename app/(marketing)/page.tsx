import { Medal } from 'lucide-react'
import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const headingFont = localFont({
  src: '../../public/fonts/font.woff2',
})

const textFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn('flex flex-col items-center justify-center', headingFont.className)}>
      <div className="mb-4 flex items-center rounded-full border bg-cyan-500 p-4 uppercase text-white shadow-sm">
          <Medal className="mr-2 h-6 w-6" />
          No 1 task management
        </div>
        <h1 className="mb-6 text-center text-3xl text-neutral-800 md:text-6xl">
          Colab Nest helps team move
        </h1>
        <div className="w-fit rounded-md bg-gradient-to-r from-cyan-500 to-pink-500 p-2 px-4 pb-4 text-3xl text-white md:text-6xl">work forward.</div>
      </div>
      <br></br>
      <div
        className={cn(
          'w-fit rounded-md bg-gradient-to-r from-pink-500 to-cyan-500 p-2 px-2 pb-2 text-xl text-white md:text-xl',
          textFont.className
        )}
      >
         "Colab Nest: Empower Your Team, Anywhere, Anytime."
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/sign-up">Try Colab Nest for free</Link>
      </Button>
    </div>
  )
}