import prisma from '@/lib/db'
import { ListContainer } from './_components/list-container'

export default async function BoardIdPage({ params }: { params: { bboardId: string } }) {
  const orgId='b_123'
  const list = await prisma.list.findMany({
    where: {
      boardId: params.bboardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  })
  return (
    <div className="w-full overflow-x-auto p-4">
      <ListContainer boardId={params.bboardId} initialData={list} orgId={orgId} />
    </div>
  )
}
