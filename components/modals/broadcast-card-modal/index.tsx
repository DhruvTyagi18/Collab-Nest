import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useBroadcastModal } from '@/hooks/use-broadcast-modal'
import { trpc } from '@/trpc/client'
import { BroadcastActions } from './actions'
import { BroadcastActivity } from './activity'
import { BroadcastDescription } from './description'
import { BroadcastHeader } from './header'

export function BroadcastCardModal() {
  const { isOpen, onClose, onOpen, id, refetchLists } = useBroadcastModal()

  const { data: cardData, refetch: refetchCard } = trpc.card.getBroadcastCard.useQuery({
    id: id ?? '',
  })

  const { data: dataAuditLogs, refetch: refetchAuditLogs } = trpc.getLogs.useQuery({
    cardId: id ?? '',
  })

  const handleClose = () => {
    onClose()  
    window.location.reload(); 
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {!cardData ? (
          <BroadcastHeader.Skeleton />
        ) : (
          <BroadcastHeader
            data={cardData as any}
            refetchCard={refetchCard}
            refetchLists={refetchLists}
            refetchAuditLogs={refetchAuditLogs}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <BroadcastDescription.Skeleton />
              ) : (
                <BroadcastDescription
                  data={cardData as any}
                  refetchCard={refetchCard}
                  refetchLists={refetchLists}
                  refetchAuditLogs={refetchAuditLogs}
                />
              )}
              {!dataAuditLogs ? <BroadcastActivity.Skeleton /> : <BroadcastActivity items={dataAuditLogs as any} />}
            </div>
          </div>
          {!cardData ? (
            <BroadcastActions.Skeleton />
          ) : (
            <BroadcastActions data={cardData as any} refetchLists={refetchLists} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
