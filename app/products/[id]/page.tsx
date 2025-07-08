import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { products } from "@/lib/data"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      <RelatedProducts currentProductId={product.id} />
    </div>
  )
}
