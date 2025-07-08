"use client"

import type React from "react"
import { useState } from "react"
import { ValidatedInput } from "@/components/forms/validated-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateField, validateNumber } from "@/lib/validation"

interface CouponFormProps {
  onSubmit: (coupon: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export function CouponForm({ onSubmit, initialData, isLoading = false }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    description: initialData?.description || "",
    discountType: initialData?.discountType || "percentage",
    discountValue: initialData?.discountValue || "",
    minimumAmount: initialData?.minimumAmount || "",
    usageLimit: initialData?.usageLimit || "",
    maxUsesPerUser: initialData?.maxUsesPerUser || "1",
    firstPurchaseOnly: initialData?.firstPurchaseOnly || false,
    validFrom: initialData?.validFrom || "",
    validUntil: initialData?.validUntil || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Validações
  const validateCode = (value: string) => {
    if (value.length < 3) return "Código deve ter pelo menos 3 caracteres"
    if (!/^[A-Z0-9]+$/.test(value)) return "Código deve conter apenas letras maiúsculas e números"
    return validateField(value, 50, "Código")
  }
  const validateDescription = (value: string) => validateField(value, 500, "Descrição")
  const validateDiscountValue = (value: string) => {
    const num = Number.parseFloat(value)
    if (formData.discountType === "percentage") {
      return validateNumber(num, 0.01, 100, "Valor do desconto")
    } else {
      return validateNumber(num, 0.01, 9999999.99, "Valor do desconto")
    }
  }
  const validateMinimumAmount = (value: string) => {
    if (!value) return null
    const num = Number.parseFloat(value)
    return validateNumber(num, 0, 9999999.99, "Valor mínimo")
  }
  const validateUsageLimit = (value: string) => {
    if (!value) return null
    const num = Number.parseInt(value)
    return validateNumber(num, 1, 999999, "Limite de uso")
  }
  const validateMaxUsesPerUser = (value: string) => {
    const num = Number.parseInt(value)
    return validateNumber(num, 1, 999, "Limite por usuário")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cupom de Desconto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="Código do Cupom"
              value={formData.code}
              onChange={(value) => handleChange("code", value.toUpperCase())}
              validation={validateCode}
              maxLength={50}
              required
              placeholder="DESCONTO10"
              showCounter
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tipo de Desconto <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleChange("discountType", e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="percentage">Porcentagem (%)</option>
                <option value="fixed_amount">Valor Fixo (R$)</option>
              </select>
            </div>
          </div>

          <ValidatedInput
            label="Descrição"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            validation={validateDescription}
            maxLength={500}
            multiline
            rows={3}
            placeholder="Descrição do cupom"
            showCounter
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              label={`Valor do Desconto ${formData.discountType === "percentage" ? "(%)" : "(R$)"}`}
              type="number"
              value={formData.discountValue}
              onChange={(value) => handleChange("discountValue", value)}
              validation={validateDiscountValue}
              required
              placeholder={formData.discountType === "percentage" ? "10" : "50.00"}
            />

            <ValidatedInput
              label="Valor Mínimo (R$)"
              type="number"
              value={formData.minimumAmount}
              onChange={(value) => handleChange("minimumAmount", value)}
              validation={validateMinimumAmount}
              placeholder="100.00"
            />

            <ValidatedInput
              label="Limite de Uso"
              type="number"
              value={formData.usageLimit}
              onChange={(value) => handleChange("usageLimit", value)}
              validation={validateUsageLimit}
              placeholder="100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="Máximo por Usuário"
              type="number"
              value={formData.maxUsesPerUser}
              onChange={(value) => handleChange("maxUsesPerUser", value)}
              validation={validateMaxUsesPerUser}
              required
              placeholder="1"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Configurações</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="firstPurchaseOnly"
                  checked={formData.firstPurchaseOnly}
                  onChange={(e) => handleChange("firstPurchaseOnly", e.target.checked)}
                />
                <label htmlFor="firstPurchaseOnly" className="text-sm">
                  Apenas primeira compra
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="Válido a partir de"
              type="datetime-local"
              value={formData.validFrom}
              onChange={(value) => handleChange("validFrom", value)}
            />

            <ValidatedInput
              label="Válido até"
              type="datetime-local"
              value={formData.validUntil}
              onChange={(value) => handleChange("validUntil", value)}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
            {isLoading ? "Salvando..." : "Salvar Cupom"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
