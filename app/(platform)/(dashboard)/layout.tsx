import { auth } from '@clerk/nextjs'
import Navbar from './_components/navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { orgId } = auth();

  return (
    <div className="h-full">
      <Navbar orgId={orgId} />
      {children}
    </div>
  )
}
