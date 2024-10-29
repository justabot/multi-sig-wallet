import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'MultiSig Wallet',
  description: 'A decentralized multi-signature wallet application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 