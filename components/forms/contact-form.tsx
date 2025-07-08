"use client"

import type React from "react"

import { useState } from "react"
import { ValidatedInput } from "./validated-input"
import { ValidatedTextarea } from "./validated-textarea"
import { contactSchema } from "@/lib/validation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro do campo quando o usuário digita
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateField = (field: keyof ContactFormData, value: string): string | undefined => {
    try {
      const fieldSchema = contactSchema.shape[field]
      if (fieldSchema) {
        fieldSchema.parse(value)
      }
      return undefined
    } catch (error: any) {
      return error.errors?.[0]?.message || "Valor inválido"
    }
  }

  const validateForm = (): boolean => {
    try {
      contactSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        if (err.path?.[0]) {
          newErrors[err.path[0]] = err.message
        }
      })
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simular envio do formulário
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Dados do contato:", formData)
      setIsSubmitted(true)

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contato. Responderemos em breve.",
      })

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Mensagem Enviada!</h3>
            <p className="text-gray-600">Obrigado pelo seu contato. Responderemos em breve!</p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Enviar Nova Mensagem
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulário de Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Entre em Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                name="name"
                label="Nome Completo"
                value={formData.name}
                onChange={(value) => updateField("name", value)}
                error={errors.name}
                required
                maxLength={100}
                showCounter
                validate={(value) => validateField("name", value)}
              />

              <ValidatedInput
                name="email"
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(value) => updateField("email", value)}
                error={errors.email}
                required
                maxLength={255}
                showCounter
                validate={(value) => validateField("email", value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                name="phone"
                label="Telefone"
                value={formData.phone}
                onChange={(value) => updateField("phone", value)}
                error={errors.phone}
                mask="phone"
                validate={(value) => validateField("phone", value)}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Assunto <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione o assunto</option>
                  <option value="Dúvida sobre produto">Dúvida sobre produto</option>
                  <option value="Status do pedido">Status do pedido</option>
                  <option value="Troca/Devolução">Troca/Devolução</option>
                  <option value="Suporte técnico">Suporte técnico</option>
                  <option value="Reclamação">Reclamação</option>
                  <option value="Sugestão">Sugestão</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <ValidatedTextarea
              name="message"
              label="Mensagem"
              value={formData.message}
              onChange={(value) => updateField("message", value)}
              error={errors.message}
              required
              maxLength={2000}
              showCounter
              rows={6}
              placeholder="Descreva sua dúvida ou solicitação..."
              validate={(value) => validateField("message", value)}
            />

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-gray-600">contato@ecostore.com</p>
                <p className="text-gray-600">suporte@ecostore.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-gray-600">(11) 99999-9999</p>
                <p className="text-gray-600">(11) 3333-3333</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Endereço</p>
                <p className="text-gray-600">
                  Rua das Flores, 123
                  <br />
                  Centro - São Paulo/SP
                  <br />
                  CEP: 01234-567
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Horário de Atendimento</p>
                <p className="text-gray-600">
                  Segunda a Sexta: 9h às 18h
                  <br />
                  Sábado: 9h às 14h
                  <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Como faço para rastrear meu pedido?</h4>
              <p className="text-sm text-gray-600">
                Você receberá um código de rastreamento por e-mail assim que seu pedido for enviado.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Qual o prazo de entrega?</h4>
              <p className="text-sm text-gray-600">
                O prazo varia de acordo com sua região, geralmente entre 3 a 10 dias úteis.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Posso trocar ou devolver um produto?</h4>
              <p className="text-sm text-gray-600">Sim, você tem até 30 dias para solicitar troca ou devolução.</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Como funciona a garantia?</h4>
              <p className="text-sm text-gray-600">
                Todos os produtos têm garantia do fabricante. Consulte os detalhes na página do produto.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
