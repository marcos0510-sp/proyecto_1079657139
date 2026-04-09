import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['300', '400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mi App TypeScript',
  description: 'Aplicación Next.js con TypeScript, Tailwind CSS y animaciones con Framer Motion',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.className}>
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  )
}
