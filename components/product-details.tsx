"use client"

import { useState } from "react"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/data"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews} avaliações)</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <>
              <span className="text-xl text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
              <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}% OFF</Badge>
            </>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded-lg">
            <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-600">Em estoque</span>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleAddToCart} className="flex-1 bg-green-600 hover:bg-green-700" size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao Carrinho
          </Button>
          <Button variant="outline" size="lg">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Marca</span>
                <span className="text-gray-600">{product.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Categoria</span>
                <span className="text-gray-600">{product.category}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-gray-600">
              {product.reviews} avaliações com média de {product.rating} estrelas.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
