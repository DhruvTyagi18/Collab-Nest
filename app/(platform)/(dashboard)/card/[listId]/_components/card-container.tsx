'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { trpc } from '@/trpc/client'
import { CardLayout } from './card-layout'
import { Card } from '@prisma/client'

type ListContainerProps = {
    boardId: string
    initialData: Card[]
    listId: string
}

export function CardContainer({ boardId,initialData, listId }: ListContainerProps) {
  const [orderedData, setOrderedData] = useState(initialData)

  useEffect(() => {
    setOrderedData(initialData)
  }, [initialData])

  const { mutate: mutateUpdateCardOrder } = trpc.card.updateCardOrder.useMutation({
    onSuccess: () => {
      toast.success('Card reordered')
    },
    onError: (err) => {
      toast.error(err.data?.code)
    },
  })

  return (
    <div className="flex flex-wrap gap-3 h-[80vh] overflow-y-auto">
        <CardLayout
          boardId={boardId}
          data={initialData}
          listId={listId}
        />
      <div className="w-full flex-shrink-0" aria-hidden="true" />
    </div>
  )
}
