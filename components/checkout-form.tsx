"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" placeholder="Seu nome" />
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" placeholder="Seu sobrenome" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" placeholder="(11) 99999-9999" />
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" placeholder="Rua, número" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" placeholder="Sua cidade" />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" placeholder="00000-000" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit" id="credit" />
              <Label htmlFor="credit">Cartão de Crédito</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="debit" id="debit" />
              <Label htmlFor="debit">Cartão de Débito</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix">PIX</Label>
            </div>
          </RadioGroup>

          {(paymentMethod === "credit" || paymentMethod === "debit") && (
            <div className="mt-6 space-y-4">
              <Separator />
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Validade</Label>
                  <Input id="expiry" placeholder="MM/AA" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="000" />
                </div>
              </div>
              <div>
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input id="cardName" placeholder="Nome como no cartão" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
