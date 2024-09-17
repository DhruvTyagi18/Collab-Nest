import { Footer } from './_components/footer'
import { Navbar } from './_components/navbar'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main
        className="bg-slate-100 pb-20 pt-40"
        style={{
          backgroundImage: 'url(/Designerr.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
        }}
      >
  {children}
</main>

      <Footer />
    </div>
  )
}