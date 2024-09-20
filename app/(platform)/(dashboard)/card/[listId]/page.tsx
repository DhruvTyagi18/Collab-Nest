import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import prisma from '@/lib/db'
import { CardContainer } from './_components/card-container'

export default async function ListIdPage({ params }: { params: { listId: string } }) {
  const { orgId } = auth()

  if (!orgId) {
    redirect('/select-org')
  }

  const cards = await prisma.card.findMany({
    where: {
      listId: params.listId
    },
    orderBy: {
      order: 'asc',
    },
  })

  const list=await prisma.list.findUnique({
    where:{
      id: params.listId
    }
  })

  return (
    <div className="w-full overflow-x-auto p-4">
      <CardContainer  boardId={list?.boardId as string} initialData={cards} listId={params.listId} />
    </div>
  )
}
