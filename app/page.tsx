import { readHomeData } from '@/lib/dataService'
import { HolaMundo } from '@/components/HolaMundo'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const homeData = readHomeData()

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <section className="relative z-10 max-w-4xl w-full">
        <HolaMundo
          title={homeData.hero.title}
          subtitle={homeData.hero.subtitle}
          description={homeData.hero.description}
        />
      </section>
    </main>
  )
}
  const homeData = readHomeData()

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <section className="relative z-10 max-w-4xl w-full">
        <HolaMundo
          title={homeData.hero.title}
          subtitle={homeData.hero.subtitle}
          description={homeData.hero.description}
        />
      </section>
    </main>
  )
}
