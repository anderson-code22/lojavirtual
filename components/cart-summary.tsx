"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"

export function CartSummary() {
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
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Frete</span>
          <span>{shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">R$ {finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {shipping > 0 && <p className="text-sm text-gray-600">Frete grátis para compras acima de R$ 200,00</p>}

        <Link href="/checkout" className="block">
          <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
            Finalizar Compra
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
