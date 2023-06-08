import './globals.css'

export const metadata = {
  title: 'Gonçalves Dias',
  description: 'Conversando com Gonçalves Dias', 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
