"use client"

import type React from "react"
import { useState } from "react"
import { ValidatedInput } from "@/components/forms/validated-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateZipCode, validateField } from "@/lib/validation"

interface AddressFormProps {
  onSubmit: (address: any) => void
  initialData?: any
  title?: string
}

export function AddressForm({ onSubmit, initialData, title = "Endereço" }: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: initialData?.street || "",
    number: initialData?.number || "",
    complement: initialData?.complement || "",
    neighborhood: initialData?.neighborhood || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    type: initialData?.type || "shipping",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleZipCodeChange = async (zipCode: string) => {
    setFormData((prev) => ({ ...prev, zipCode }))

    // Auto-completar endereço via CEP (simulado)
    if (zipCode.replace(/\D/g, "").length === 8) {
      try {
        // Simular consulta de CEP
        await new Promise((resolve) => setTimeout(resolve, 500))

        setFormData((prev) => ({
          ...prev,
          street: "Rua das Flores",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
        }))
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      }
    }
  }

  // Validações
  const validateStreet = (value: string) => {
    if (value.length < 5) return "Endereço deve ter pelo menos 5 caracteres"
    return validateField(value, 255, "Endereço")
  }
  const validateNumber = (value: string) => {
    if (!value.trim()) return "Número é obrigatório"
    return validateField(value, 20, "Número")
  }
  const validateComplement = (value: string) => validateField(value, 100, "Complemento")
  const validateNeighborhood = (value: string) => {
    if (value.length < 2) return "Bairro deve ter pelo menos 2 caracteres"
    return validateField(value, 100, "Bairro")
  }
  const validateCity = (value: string) => {
    if (value.length < 2) return "Cidade deve ter pelo menos 2 caracteres"
    return validateField(value, 100, "Cidade")
  }
  const validateState = (value: string) => {
    if (value.length !== 2) return "Estado deve ter 2 caracteres"
    return null
  }

  const states = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              label="CEP"
              value={formData.zipCode}
              onChange={handleZipCodeChange}
              validation={validateZipCode}
              maxLength={10}
              required
              placeholder="00000-000"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Selecione</option>
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <ValidatedInput
              label="Cidade"
              value={formData.city}
              onChange={(value) => handleChange("city", value)}
              validation={validateCity}
              maxLength={100}
              required
              placeholder="Sua cidade"
            />
          </div>

          <ValidatedInput
            label="Endereço"
            value={formData.street}
            onChange={(value) => handleChange("street", value)}
            validation={validateStreet}
            maxLength={255}
            required
            placeholder="Rua, avenida, etc."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              label="Número"
              value={formData.number}
              onChange={(value) => handleChange("number", value)}
              validation={validateNumber}
              maxLength={20}
              required
              placeholder="123"
            />

            <ValidatedInput
              label="Complemento"
              value={formData.complement}
              onChange={(value) => handleChange("complement", value)}
              validation={validateComplement}
              maxLength={100}
              placeholder="Apto, casa, etc."
            />

            <ValidatedInput
              label="Bairro"
              value={formData.neighborhood}
              onChange={(value) => handleChange("neighborhood", value)}
              validation={validateNeighborhood}
              maxLength={100}
              required
              placeholder="Seu bairro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Endereço</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="shipping"
                  checked={formData.type === "shipping"}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
                <span>Entrega</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="billing"
                  checked={formData.type === "billing"}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
                <span>Cobrança</span>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Salvando..." : "Salvar Endereço"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
