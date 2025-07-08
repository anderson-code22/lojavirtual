import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Tablet,
  Monitor,
  Keyboard,
  Mouse,
  Speaker,
  Tv,
} from "lucide-react"

const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    description: "Os últimos lançamentos em celulares",
    icon: Smartphone,
    productCount: 45,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: "laptops",
    name: "Laptops",
    description: "Notebooks para trabalho e entretenimento",
    icon: Laptop,
    productCount: 32,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: "audio",
    name: "Áudio",
    description: "Fones, caixas de som e equipamentos de áudio",
    icon: Headphones,
    productCount: 67,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "watches",
    name: "Smartwatches",
    description: "Relógios inteligentes e fitness trackers",
    icon: Watch,
    productCount: 28,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "cameras",
    name: "Câmeras",
    description: "Câmeras digitais e equipamentos fotográficos",
    icon: Camera,
    productCount: 19,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "games",
    name: "Games",
    description: "Consoles, jogos e acessórios para gamers",
    icon: Gamepad2,
    productCount: 156,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: "tablets",
    name: "Tablets",
    description: "iPads e tablets Android",
    icon: Tablet,
    productCount: 24,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "monitors",
    name: "Monitores",
    description: "Monitores para PC e workstations",
    icon: Monitor,
    productCount: 38,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "peripherals",
    name: "Periféricos",
    description: "Teclados, mouses e acessórios",
    icon: Keyboard,
    productCount: 89,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "speakers",
    name: "Caixas de Som",
    description: "Alto-falantes e sistemas de som",
    icon: Speaker,
    productCount: 43,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "tv",
    name: "TVs",
    description: "Smart TVs e equipamentos de entretenimento",
    icon: Tv,
    productCount: 31,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "accessories",
    name: "Acessórios",
    description: "Capas, carregadores e outros acessórios",
    icon: Mouse,
    productCount: 124,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
]

export function CategoryGrid() {
  const featuredCategories = categories.filter((cat) => cat.featured)
  const regularCategories = categories.filter((cat) => !cat.featured)

  return (
    <div className="space-y-12">
      {/* Featured Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">Destaque</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-green-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">{category.productCount} produtos</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* All Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas as Categorias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {regularCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount} produtos
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
