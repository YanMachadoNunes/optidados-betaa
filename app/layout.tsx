import { Providers } from "./providers"
import "./globals.css"
import { Eye } from "lucide-react"

export const metadata = {
  title: "OptiGestão",
  description: "Sistema de Gestão para Óticas",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%233b82f6' rx='15' width='100' height='100'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold'>O</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem("optigestao_theme") || "dark";
                document.documentElement.setAttribute("data-theme", theme);
              })();
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
