"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2 } from "lucide-react"

const mockCategories = [
  {
    id: "1",
    name: "Smartphones",
    slug: "smartphones",
    description: "Celulares e acessórios",
    featured: true,
    productCount: 45,
  },
  {
    id: "2",
    name: "Laptops",
    slug: "laptops",
    description: "Notebooks e ultrabooks",
    featured: true,
    productCount: 32,
  },
  {
    id: "3",
    name: "Áudio",
    slug: "audio",
    description: "Fones e equipamentos de áudio",
    featured: false,
    productCount: 67,
  },
  {
    id: "4",
    name: "Smartwatches",
    slug: "watches",
    description: "Relógios inteligentes",
    featured: false,
    productCount: 28,
  },
  {
    id: "5",
    name: "Câmeras",
    slug: "cameras",
    description: "Câmeras digitais e acessórios",
    featured: false,
    productCount: 19,
  },
  { id: "6", name: "Games", slug: "games", description: "Consoles e jogos", featured: true, productCount: 156 },
]

export function CategoriesManager() {
  const [categories, setCategories] = useState(mockCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    featured: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      // Atualizar categoria
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, "-") }
            : cat,
        ),
      )
    } else {
      // Nova categoria
      const newCategory = {
        id: Date.now().toString(),
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        productCount: 0,
      }
      setCategories([...categories, newCategory])
    }

    setFormData({ name: "", description: "", featured: false })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      featured: category.featured,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (categoryId: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId))
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", featured: false })
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Organize os produtos em categorias</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Smartphones"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Categoria em destaque</Label>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingCategory ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-600">/{category.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.productCount} produtos</TableCell>
                  <TableCell>
                    <Badge
                      variant={category.featured ? "default" : "secondary"}
                      className={category.featured ? "bg-green-100 text-green-800" : ""}
                    >
                      {category.featured ? "Destaque" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
