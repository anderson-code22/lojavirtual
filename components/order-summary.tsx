"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"

export function OrderSummary() {
  const { items, total } = useCart()

  const subtotal = total
  const shipping = subtotal > 200 ? 0 : 15
  const finalTotal = subtotal + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Frete</span>
            <span>{shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">R$ {finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
          Confirmar Pedido
        </Button>
      </CardContent>
    </Card>
  )
}
