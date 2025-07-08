"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular verificação de permissão
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/admin")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirecionamento em andamento
  }

  // Verificar se é admin (por enquanto, verificar email)
  const isAdmin = user?.email === "admin@ecostore.com" || user?.role === "admin"

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-6">Você não tem permissão para acessar o painel administrativo.</p>
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">Voltar ao Início</Button>
              </Link>
              <p className="text-sm text-gray-500">Para acesso admin, use: admin@ecostore.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-semibold">Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.name}</span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Ver Loja
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
