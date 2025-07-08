"use client"

import type React from "react"
import { useState } from "react"
import { Star } from "lucide-react"
import { ValidatedInput } from "@/components/forms/validated-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateField } from "@/lib/validation"

interface ReviewFormProps {
  productId: string
  onSubmit: (review: any) => Promise<void>
  isLoading?: boolean
}

export function ReviewForm({ productId, onSubmit, isLoading = false }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    recommend: true,
    pros: [""],
    cons: [""],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      productId,
      pros: formData.pros.filter((p) => p.trim()),
      cons: formData.cons.filter((c) => c.trim()),
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const addPro = () => {
    setFormData((prev) => ({ ...prev, pros: [...prev.pros, ""] }))
  }

  const addCon = () => {
    setFormData((prev) => ({ ...prev, cons: [...prev.cons, ""] }))
  }

  const updatePro = (index: number, value: string) => {
    const newPros = [...formData.pros]
    newPros[index] = value
    setFormData((prev) => ({ ...prev, pros: newPros }))
  }

  const updateCon = (index: number, value: string) => {
    const newCons = [...formData.cons]
    newCons[index] = value
    setFormData((prev) => ({ ...prev, cons: newCons }))
  }

  const removePro = (index: number) => {
    setFormData((prev) => ({ ...prev, pros: prev.pros.filter((_, i) => i !== index) }))
  }

  const removeCon = (index: number) => {
    setFormData((prev) => ({ ...prev, cons: prev.cons.filter((_, i) => i !== index) }))
  }

  // Validações
  const validateTitle = (value: string) => validateField(value, 255, "Título")
  const validateComment = (value: string) => {
    if (value.length < 10) return "Comentário deve ter pelo menos 10 caracteres"
    return validateField(value, 2000, "Comentário")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Avaliação <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => handleRatingClick(star)} className="focus:outline-none">
                  <Star
                    className={`h-8 w-8 ${star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating > 0
                  ? `${formData.rating} estrela${formData.rating > 1 ? "s" : ""}`
                  : "Clique para avaliar"}
              </span>
            </div>
          </div>

          <ValidatedInput
            label="Título da Avaliação"
            value={formData.title}
            onChange={(value) => handleChange("title", value)}
            validation={validateTitle}
            maxLength={255}
            placeholder="Resumo da sua experiência"
            showCounter
          />

          <ValidatedInput
            label="Comentário"
            value={formData.comment}
            onChange={(value) => handleChange("comment", value)}
            validation={validateComment}
            maxLength={2000}
            multiline
            rows={4}
            required
            placeholder="Conte sobre sua experiência com o produto..."
            showCounter
          />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pontos Positivos</label>
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <ValidatedInput
                    label=""
                    value={pro}
                    onChange={(value) => updatePro(index, value)}
                    maxLength={200}
                    placeholder="O que você gostou?"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removePro(index)}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addPro} className="mt-2 bg-transparent">
                Adicionar Ponto Positivo
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium">Pontos Negativos</label>
              {formData.cons.map((con, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <ValidatedInput
                    label=""
                    value={con}
                    onChange={(value) => updateCon(index, value)}
                    maxLength={200}
                    placeholder="O que poderia melhorar?"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeCon(index)}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addCon} className="mt-2 bg-transparent">
                Adicionar Ponto Negativo
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recommend"
              checked={formData.recommend}
              onChange={(e) => handleChange("recommend", e.target.checked)}
            />
            <label htmlFor="recommend" className="text-sm">
              Eu recomendaria este produto
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || formData.rating === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
