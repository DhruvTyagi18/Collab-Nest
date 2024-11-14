import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { ListNavbar } from './_components/list-navbar';

export async function generateMetadata({ params }: { params: { blistId: string } }) {

  const list = await prisma.list.findUnique({
    where: { id: params.blistId },
  });

  return { title: list?.title || 'List' };
}

export default async function ListIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { blistId: string };
}) {
  const orgId= 'b_123';

  const list = await prisma.list.findUnique({
    where: { id: params.blistId },
  });

  if (!list) {
    return notFound();
  }

  const board = await prisma.board.findUnique({
    where: { id: list.boardId, orgId },
  });

  if (!board) {
    return notFound();
  }

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full bg-cover bg-center bg-no-repeat"
    >
      <ListNavbar list={list} orgId={orgId}/>
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <main className="relative h-full pt-28">{children}</main>
    </div>
  );
}
