"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"

export function CartItems() {
  const { items, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Seu carrinho está vazio</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-green-600 font-bold">R$ {item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
