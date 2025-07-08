"use client"

import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

export function FeaturedProducts() {
  const featuredProducts = products.slice(0, 8)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Confira nossa seleção especial dos produtos mais populares e bem avaliados
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
