import prisma from '@/lib/db'
import { CardContainer } from './_components/card-container'

export default async function ListIdPage({ params }: { params: { blistId: string } }) {
  const orgId='b_123'

  const cards = await prisma.card.findMany({
    where: {
      listId: params.blistId
    },
    orderBy: {
      order: 'asc',
    },
  })

  const list=await prisma.list.findUnique({
    where:{
      id: params.blistId
    }
  })

  return (
    <div className="w-full overflow-x-auto p-4">
      <CardContainer  boardId={list?.boardId as string} initialData={cards} listId={params.blistId} />
    </div>
  )
}
