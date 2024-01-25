import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ThermCoin Pool',
  description: 'Mining Pool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-full bg-[#f4eee0] tracking-wider">{children}</body>
    </html>
  )
}
