"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react"
import { products as mockProducts } from "@/lib/data"

export function ProductsManager() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  const toggleProductStatus = (productId: string) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Produtos</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">R$ {product.price.toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.inStock ? "default" : "secondary"}
                      className={product.inStock ? "bg-green-100 text-green-800" : ""}
                    >
                      {product.inStock ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{Math.floor(Math.random() * 100 + 1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleProductStatus(product.id)}>
                          <Package className="mr-2 h-4 w-4" />
                          {product.inStock ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum produto encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
