"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular envio (em produção, fazer chamada para API)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      console.error("Erro ao enviar mensagem")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o assunto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duvida">Dúvida sobre produto</SelectItem>
                  <SelectItem value="pedido">Status do pedido</SelectItem>
                  <SelectItem value="troca">Troca/Devolução</SelectItem>
                  <SelectItem value="suporte">Suporte técnico</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Descreva sua dúvida ou solicitação..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
