import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl">EcoStore</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sua loja online de confiança com os melhores produtos e atendimento excepcional.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Produtos
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Categorias
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sobre Nós
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Atendimento</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Central de Ajuda
              </Link>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Entrega
              </Link>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Devoluções
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacidade
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contato@ecostore.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 EcoStore. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
