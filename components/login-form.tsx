"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simular login (em produção, fazer chamada para API)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "admin@ecostore.com" && password === "123456") {
        login({
          id: "1",
          name: "Administrador",
          email: "admin@ecostore.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin",
        })
        router.push("/admin")
      } else if (email && password) {
        login({
          id: "2",
          name: "Usuário",
          email: email,
          avatar: "/placeholder.svg?height=40&width=40",
          role: "user",
        })
        router.push("/")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>
              <strong>Dados de teste Admin:</strong>
            </p>
            <p>Email: admin@ecostore.com</p>
            <p>Senha: 123456</p>
            <hr className="my-2" />
            <p>
              <strong>Usuário normal:</strong>
            </p>
            <p>Qualquer email e senha</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
