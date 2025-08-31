import Link from "next/link"
import { Shield, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const footerLinks = {
  sections: [
    { name: "Política", href: "/politica" },
    { name: "Economía", href: "/economia" },
    { name: "Deportes", href: "/deportes" },
    { name: "Tecnología", href: "/tecnologia" },
  ],
  company: [
    { name: "Acerca de", href: "/acerca-de" },
    { name: "Equipo", href: "/acerca-de#equipo" },
    { name: "Trabaja con Nosotros", href: "/contacto" },
    { name: "Contacto", href: "/contacto" },
  ],
  legal: [
    { name: "Términos de Uso", href: "/contacto" },
    { name: "Política de Privacidad", href: "/contacto" },
    { name: "Código de Ética", href: "/contacto" },
  ],
  social: [
    { name: "Facebook", href: "https://facebook.com/trueblock", icon: Facebook },
    { name: "Twitter", href: "https://twitter.com/trueblock", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com/trueblock", icon: Instagram },
    { name: "YouTube", href: "https://youtube.com/trueblock", icon: Youtube },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-primary">TrueBlock</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Tu plataforma confiable de noticias verificadas. Combatimos la desinformación con tecnología blockchain y
              verificación comunitaria.
            </p>
            <div className="flex space-x-3">
              {footerLinks.social.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Secciones</h3>
            <ul className="space-y-2">
              {footerLinks.sections.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">Recibe noticias verificadas en tu correo.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
              <button className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 TrueBlock. Todos los derechos reservados. | Noticias verificadas con blockchain las 24 horas.
          </p>
        </div>
      </div>
    </footer>
  )
}
