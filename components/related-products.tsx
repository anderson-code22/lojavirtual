"use client"

import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const relatedProducts = products.filter((product) => product.id !== currentProductId).slice(0, 4)

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
