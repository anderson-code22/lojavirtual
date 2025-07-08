import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Descubra Produtos
                <span className="text-green-600"> Incríveis</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Encontre tudo o que você precisa em nossa loja online com os melhores preços e qualidade garantida.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Comprar Agora
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Ver Categorias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Hero Product"
                className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold text-sm">
              Frete Grátis!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
