'use client'

import { MoreHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { trpc } from '@/trpc/client'
import { checkUserRole } from '@/app/api/utils/userUtils';
import { SignedIn, useSession } from '@clerk/nextjs';

type ListOptionsProps = {
  id: string
  boardId: string
  orgId:string
}

export function ListOptions({ id,boardId,orgId }: ListOptionsProps) {
  const router = useRouter()
  const { session } = useSession();
  const userRole = checkUserRole(session,orgId);

  const { mutate, isLoading } = trpc.list.deleteList.useMutation({
    onSuccess: ({ boardId }) => {
      router.push(`/board/${boardId}`)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onDelete = () => {
    mutate({
      id,
      boardId
    })
  }

  return (
    <SignedIn>
      {userRole === 'org:admin' && (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">Board actions</div>
        <PopoverClose asChild>
          <Button
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          Delete this List
        </Button>
      </PopoverContent>
    </Popover>)}
    </SignedIn>
  )
}
