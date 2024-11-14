import { Copy, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCardModal } from '@/hooks/use-card-modal'
import { trpc } from '@/trpc/client'
import { CardWithList } from '@/types'
import { Card } from '@prisma/client'

type ActionsProps = {
  data: CardWithList
  refetchLists: ()=>void
}

export function BroadcastActions({ data,refetchLists }: ActionsProps) {
  const params = useParams()
  const { onClose } = useCardModal()

  const { mutate: mutateCopyCard, isLoading: isLoadingCopyCard } = trpc.card.copyBroadcastCard.useMutation({
    onSuccess: ({ card }) => {
      toast.success(`Card "${card.title}" copied`)
      window.location.reload()  
      onClose()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const { mutate: mutateDeleteCard, isLoading: isLoadingDeleteCard } =
    trpc.card.deleteBroadcastCard.useMutation({
      onSuccess: ({ card }) => {
        toast.success(`Card "${card.title}" deleted`)
        window.location.reload()  
        onClose()
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })

  const onCopy = () => {
    mutateCopyCard({ id: data.id, listId: params.blistId as string })
  }

  const onDelete = () => {
    mutateDeleteCard({ id: data.id, listId: params.blistId as string })
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-semibold">Actions</p>
      <Button
        variant="gray"
        size="inline"
        className="w-full justify-start"
        disabled={isLoadingCopyCard}
        onClick={onCopy}
      >
        <Copy className="mr-2 h-4 w-4" aria-hidden="true" /> Copy
      </Button>
      <Button
        variant="gray"
        size="inline"
        className="w-full justify-start"
        disabled={isLoadingDeleteCard}
        onClick={onDelete}
      >
        <Trash className="mr-2 h-4 w-4" aria-hidden="true" /> Delete
      </Button>
    </div>
  )
}

BroadcastActions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  )
}
