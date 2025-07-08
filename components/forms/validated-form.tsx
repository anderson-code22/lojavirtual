"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { type ValidationSchema, validateForm } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ValidatedFormProps {
  children: React.ReactNode
  onSubmit: (data: Record<string, string>) => Promise<void> | void
  schema: ValidationSchema
  initialData?: Record<string, string>
  submitText?: string
  className?: string
  disabled?: boolean
}

export function ValidatedForm({
  children,
  onSubmit,
  schema,
  initialData = {},
  submitText = "Enviar",
  className,
  disabled = false,
}: ValidatedFormProps) {
  const [data, setData] = useState<Record<string, string>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback(
    (name: string, value: string) => {
      setData((prev) => ({ ...prev, [name]: value }))

      // Limpar erro do campo quando o usuário começar a digitar
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [errors],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos os campos
    const formErrors = validateForm(data, schema)

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {typeof children === "function" ? children({ data, updateField, errors }) : children}
      </div>

      <Button type="submit" disabled={disabled || isSubmitting} className="w-full mt-6">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  )
}
