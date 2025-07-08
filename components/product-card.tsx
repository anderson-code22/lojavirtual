"use client"

import type React from "react"

import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.id}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-green-600 hover:bg-green-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}
