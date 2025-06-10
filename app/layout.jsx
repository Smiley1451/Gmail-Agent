import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MARS-Botics</title>
        <meta name="description" content="Wanna Try it!..." />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
