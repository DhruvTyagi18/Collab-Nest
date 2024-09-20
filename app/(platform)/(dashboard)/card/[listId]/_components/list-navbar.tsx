"use client"; // This directive enables the component as a Client Component

import { Board, List } from '@prisma/client'
import { ListTitleForm } from './list-title-form'
import { ListOptions } from './list-options'
import { useRouter } from 'next/navigation'

type ListNavbarProps = {
  list: List
}

export function ListNavbar({ list }: ListNavbarProps) {
  const router = useRouter()

  const handleBackClick = () => {
    router.back() // Navigates to the previous page
  }

  return (
    <div className="fixed top-14 z-40 flex h-14 w-full items-center gap-x-4 bg-black/50 px-6 text-white">
      <button onClick={handleBackClick} className="text-lg">
      &#11160; 
      </button>
      <ListTitleForm initialData={list} boardId={list.boardId} />
      <div className="ml-auto">
        <ListOptions id={list.id} boardId={list.boardId} />
      </div>
    </div>
  )
}
