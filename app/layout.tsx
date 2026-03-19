import { Providers } from "./providers"
import "./globals.css"
import { Eye } from "lucide-react"

export const metadata = {
  title: "OptiGestão",
  description: "Sistema de Gestão para Óticas",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%233b82f6' rx='15' width='100' height='100'/><circle cx='30' cy='50' r='18' fill='white' stroke='white' stroke-width='6'/><circle cx='70' cy='50' r='18' fill='white' stroke='white' stroke-width='6'/><path d='M48 50 Q50 45 52 50' stroke='white' stroke-width='5' fill='none'/><line x1='12' y1='50' x2='12' y2='45' stroke='white' stroke-width='5' stroke-linecap='round'/><line x1='88' y1='50' x2='88' y2='45' stroke='white' stroke-width='5' stroke-linecap='round'/></svg>",
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
