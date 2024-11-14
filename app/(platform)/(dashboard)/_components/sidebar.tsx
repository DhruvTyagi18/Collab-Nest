'use client'
import { useState, useEffect, useRef } from 'react'
import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { useRouter } from 'next/navigation' // Import useRouter
import { usePathname } from 'next/navigation' // Import usePathname to track route changes

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NavItem, Organization } from './nav-item'

type SidebarProps = {
  storageKey?: string
}

export function Sidebar({ storageKey = 't-sidebar-state' }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {})
  const [showBroadcast, setShowBroadcast] = useState(false)  // State for showing broadcast
  const { organization: activeOrganization, isLoaded: isLoadedOrg } = useOrganization()
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
      pageSize: 30,
    },
  })
  const router = useRouter()  // Initialize the router
  const pathname = usePathname()  // Track the current pathname

  // Ref for the Broadcast button
  const broadcastButtonRef = useRef<HTMLButtonElement>(null)

  // Close Broadcast button background when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (broadcastButtonRef.current && !broadcastButtonRef.current.contains(event.target as Node)) {
        setShowBroadcast(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Reset blue background when navigating to another page
  useEffect(() => {
    // Check if the current pathname matches the desired one
    if (pathname === '/organization/b_123/broadcast') {
      setShowBroadcast(true) // Keep blue background for this pathname
    } else {
      setShowBroadcast(false) // Reset background on other pages
    }
  }, [pathname])  // Dependency on pathname to detect route changes

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key)
      }
      return acc
    },
    []
  )

  const onExpand = (id: string) => {
    setExpanded((curr) => ({ ...curr, [id]: !expanded[id] }))
  }

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    )
  }

  // Broadcast button handler
  const handleBroadcastClick = () => {
    const broadcastOrgId = 'b_123'
    router.push(`/organization/${broadcastOrgId}/broadcast`)
    setShowBroadcast(true)  // Set the state to true when clicked
  }

  return (
    <>
      <div className="mb-1 flex items-center text-sm font-medium">
        <span className="pl-4">Workspaces</span>
        <Button type="button" size="icon" variant="ghost" className="ml-auto" asChild>
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <Button
          ref={broadcastButtonRef}  // Add ref to the Broadcast button
          type="button"
          variant="ghost"
          className={`w-full text-left rounded-lg py-2 transition-all duration-200 ${
            showBroadcast ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-100'  // Set initial background to light grey
          }`}
          onClick={handleBroadcastClick}  // Trigger the broadcast navigation
        >
          Broadcast
        </Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
          {userMemberships.data?.map(({ organization }) => (
            <NavItem
              isActive={organization.id === activeOrganization?.id}
              isExpanded={expanded[organization.id]}
              organization={organization as Organization}
              onExpand={onExpand}
              key={organization.id}
            />
          ))}
          {userMemberships.isLoading && <Skeleton className="h-10 w-full" />}
        </Accordion>
      </div>
    </>
  )
}
