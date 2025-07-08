import Link from "next/link"
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2 } from "lucide-react"

const categories = [
  { name: "Smartphones", icon: Smartphone, href: "/products?category=smartphones" },
  { name: "Laptops", icon: Laptop, href: "/products?category=laptops" },
  { name: "Áudio", icon: Headphones, href: "/products?category=audio" },
  { name: "Smartwatches", icon: Watch, href: "/products?category=watches" },
  { name: "Câmeras", icon: Camera, href: "/products?category=cameras" },
  { name: "Games", icon: Gamepad2, href: "/products?category=games" },
]

export function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorias</h2>
          <p className="text-gray-600">Explore nossas principais categorias de produtos</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
