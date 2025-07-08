"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, Plus, Eye, Edit, BarChart3 } from "lucide-react"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    // Simular carregamento de estatísticas
    setStats({
      totalProducts: 156,
      totalOrders: 1247,
      totalUsers: 3892,
      totalRevenue: 125430.5,
    })
  }, [])

  const quickActions = [
    {
      title: "Novo Produto",
      description: "Adicionar produto ao catálogo",
      icon: Plus,
      href: "/admin/products/new",
      color: "bg-green-500",
    },
    {
      title: "Ver Produtos",
      description: "Gerenciar produtos existentes",
      icon: Eye,
      href: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: "Pedidos",
      description: "Gerenciar pedidos dos clientes",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-orange-500",
    },
    {
      title: "Categorias",
      description: "Organizar categorias",
      icon: Edit,
      href: "/admin/categories",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da sua loja</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+23% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês passado</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Pedido #000{i}</p>
                    <p className="text-sm text-gray-600">Cliente {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {(Math.random() * 1000 + 100).toFixed(2)}</p>
                    <p className="text-sm text-green-600">Confirmado</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Ver Todos os Pedidos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos em Destaque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "iPhone 15 Pro Max",
                "MacBook Air M3",
                "AirPods Pro 2ª Geração",
                "Samsung Galaxy S24 Ultra",
                "PlayStation 5",
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt={product}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-gray-600">{Math.floor(Math.random() * 50 + 10)} vendas</p>
                    </div>
                  </div>
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
              ))}
            </div>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Gerenciar Produtos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
