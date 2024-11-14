import { Card } from '@prisma/client'
import { useBroadcastModal } from '@/hooks/use-broadcast-modal'

type CardItemProps = {
  data: Card
  index: number
}

export function CardItem({ data, index }: CardItemProps) {
  const { onOpen } = useBroadcastModal()

  return (
    <div
      className="truncate rounded-md border-2 border-transparent bg-white px-3 py-4 text-sm shadow-md hover:border-black transition-all duration-200"
      role="button"
      onClick={() => onOpen(data.id)}
    >
      {data.title}
    </div>
  )
}
