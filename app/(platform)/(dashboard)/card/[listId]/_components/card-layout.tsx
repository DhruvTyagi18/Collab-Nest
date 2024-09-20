'use client'

import { ElementRef, useRef, useState } from 'react'

import { CardForm } from './card-form'
import { CardItem } from './card-item'
import { Card } from '@prisma/client'

type ListItemProps = {
  data: Card[]
  boardId: string
  listId: string
}

export function CardLayout({ boardId, data, listId }: ListItemProps) {
  const textAreaRef = useRef<ElementRef<'textarea'>>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [cards, setCards] = useState<Card[]>(data) // Manage card state

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textAreaRef.current?.focus()
    }, 0)
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  // Callback to update card list when a new card is added
  const handleCardAdded = (newCard: Card) => {
    setCards((prev) => [...prev, newCard]) // Update the card state
  }

  return (
    <li className="h-full w-full shrink-0 select-none">
      <div className="w-full rounded-md pb-2 shadow-md">
        <div className="mx-1 flex flex-col px-1 py-0.5">
          <ol className="w-full">
            {cards.map((card, index) => (
              <li key={card.id} className="mb-2"> 
                <CardItem data={card} index={index} />
              </li>
            ))}
          </ol>
        </div>
        <CardForm
          boardId={boardId}
          listId={listId}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
          onCardAdded={handleCardAdded} 
        />
      </div>
    </li>
  )
}
