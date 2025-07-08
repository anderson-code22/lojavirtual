"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ValidatedInput } from "@/components/forms/validated-input"
import { ValidatedTextarea } from "@/components/forms/validated-textarea"
import { productSchema, generateSlug, validateImage } from "@/lib/validation"
import { Upload, X, Save, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Product {
  id?: string
  name: string
  slug: string
  description: string
  shortDescription: string
  sku: string
  price: number
  comparePrice?: number
  costPrice?: number
  stockQuantity: number
  minStockLevel: number
  weight?: number
  dimensions?: string
  categoryId?: string
  brand?: string
  status: "active" | "inactive" | "draft"
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  images: string[]
}

interface ProductFormProps {
  product?: Product
  categories: Array<{ id: string; name: string }>
  onSubmit: (product: Product) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    sku: product?.sku || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice,
    costPrice: product?.costPrice,
    stockQuantity: product?.stockQuantity || 0,
    minStockLevel: product?.minStockLevel || 5,
    weight: product?.weight,
    dimensions: product?.dimensions || "",
    categoryId: product?.categoryId || "",
    brand: product?.brand || "",
    status: product?.status || "draft",
    featured: product?.featured || false,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
    images: product?.images || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-gerar slug quando o nome muda
    if (field === "name" && typeof value === "string" && !product) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
    }

    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateField = (field: keyof Product, value: any): string | undefined => {
    try {
      const fieldSchema = productSchema.shape[field as keyof typeof productSchema.shape]
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
      productSchema.parse({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        price: formData.price,
        comparePrice: formData.comparePrice,
        costPrice: formData.costPrice,
        stockQuantity: formData.stockQuantity,
        minStockLevel: formData.minStockLevel,
        weight: formData.weight,
        dimensions: formData.dimensions,
        brand: formData.brand,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      })
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const validationError = validateImage(file)
      if (validationError) {
        toast({
          title: "Erro no upload",
          description: validationError,
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
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

    if (!formData.categoryId) {
      toast({
        title: "Categoria obrigatória",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      toast({
        title: "Sucesso",
        description: product ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{product ? "Editar Produto" : "Novo Produto"}</h1>
          <p className="text-gray-600">
            {product ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="pricing">Preços</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    name="name"
                    label="Nome do Produto"
                    value={formData.name}
                    onChange={(value) => updateField("name", value)}
                    error={errors.name}
                    required
                    maxLength={200}
                    showCounter
                    validate={(value) => validateField("name", value)}
                  />

                  <ValidatedInput
                    name="sku"
                    label="Código SKU"
                    value={formData.sku}
                    onChange={(value) => updateField("sku", value.toUpperCase())}
                    error={errors.sku}
                    required
                    maxLength={100}
                    showCounter
                    placeholder="PROD-001"
                    validate={(value) => validateField("sku", value)}
                  />
                </div>

                <ValidatedInput
                  name="slug"
                  label="URL Amigável (Slug)"
                  value={formData.slug}
                  onChange={(value) => updateField("slug", value)}
                  error={errors.slug}
                  required
                  maxLength={200}
                  showCounter
                  placeholder="produto-exemplo"
                  validate={(value) => validateField("slug", value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => updateField("categoryId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ValidatedInput
                    name="brand"
                    label="Marca"
                    value={formData.brand}
                    onChange={(value) => updateField("brand", value)}
                    error={errors.brand}
                    maxLength={100}
                    showCounter
                    validate={(value) => validateField("brand", value)}
                  />
                </div>

                <ValidatedTextarea
                  name="shortDescription"
                  label="Descrição Curta"
                  value={formData.shortDescription}
                  onChange={(value) => updateField("shortDescription", value)}
                  error={errors.shortDescription}
                  maxLength={500}
                  showCounter
                  rows={3}
                  validate={(value) => validateField("shortDescription", value)}
                />

                <ValidatedTextarea
                  name="description"
                  label="Descrição Completa"
                  value={formData.description}
                  onChange={(value) => updateField("description", value)}
                  error={errors.description}
                  maxLength={5000}
                  showCounter
                  rows={6}
                  validate={(value) => validateField("description", value)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Preços e Estoque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ValidatedInput
                    name="price"
                    label="Preço de Venda"
                    type="number"
                    value={formData.price.toString()}
                    onChange={(value) => updateField("price", Number.parseFloat(value) || 0)}
                    error={errors.price}
                    required
                    placeholder="0.00"
                    validate={(value) => validateField("price", Number.parseFloat(value) || 0)}
                  />

                  <ValidatedInput
                    name="comparePrice"
                    label="Preço de Comparação"
                    type="number"
                    value={formData.comparePrice?.toString() || ""}
                    onChange={(value) => updateField("comparePrice", value ? Number.parseFloat(value) : undefined)}
                    error={errors.comparePrice}
                    placeholder="0.00"
                    validate={(value) => (value ? validateField("comparePrice", Number.parseFloat(value)) : undefined)}
                  />

                  <ValidatedInput
                    name="costPrice"
                    label="Preço de Custo"
                    type="number"
                    value={formData.costPrice?.toString() || ""}
                    onChange={(value) => updateField("costPrice", value ? Number.parseFloat(value) : undefined)}
                    error={errors.costPrice}
                    placeholder="0.00"
                    validate={(value) => (value ? validateField("costPrice", Number.parseFloat(value)) : undefined)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ValidatedInput
                    name="stockQuantity"
                    label="Quantidade em Estoque"
                    type="number"
                    value={formData.stockQuantity.toString()}
                    onChange={(value) => updateField("stockQuantity", Number.parseInt(value) || 0)}
                    error={errors.stockQuantity}
                    required
                    validate={(value) => validateField("stockQuantity", Number.parseInt(value) || 0)}
                  />

                  <ValidatedInput
                    name="minStockLevel"
                    label="Estoque Mínimo"
                    type="number"
                    value={formData.minStockLevel.toString()}
                    onChange={(value) => updateField("minStockLevel", Number.parseInt(value) || 0)}
                    error={errors.minStockLevel}
                    required
                    validate={(value) => validateField("minStockLevel", Number.parseInt(value) || 0)}
                  />

                  <ValidatedInput
                    name="weight"
                    label="Peso (kg)"
                    type="number"
                    value={formData.weight?.toString() || ""}
                    onChange={(value) => updateField("weight", value ? Number.parseFloat(value) : undefined)}
                    error={errors.weight}
                    placeholder="0.000"
                    validate={(value) => (value ? validateField("weight", Number.parseFloat(value)) : undefined)}
                  />
                </div>

                <ValidatedInput
                  name="dimensions"
                  label="Dimensões (LxAxP cm)"
                  value={formData.dimensions}
                  onChange={(value) => updateField("dimensions", value)}
                  error={errors.dimensions}
                  placeholder="10x20x30"
                  maxLength={50}
                  validate={(value) => (value ? validateField("dimensions", value) : undefined)}
                />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive" | "draft") => updateField("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => updateField("featured", checked)}
                    />
                    <Label htmlFor="featured">Produto em Destaque</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP ou GIF (MAX. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg?height=128&width=128"}
                          alt={`Produto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Otimização para Buscadores (SEO)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ValidatedInput
                  name="metaTitle"
                  label="Título SEO"
                  value={formData.metaTitle || ""}
                  onChange={(value) => updateField("metaTitle", value)}
                  error={errors.metaTitle}
                  maxLength={200}
                  showCounter
                  placeholder="Título otimizado para buscadores"
                  validate={(value) => (value ? validateField("metaTitle", value) : undefined)}
                />

                <ValidatedTextarea
                  name="metaDescription"
                  label="Descrição SEO"
                  value={formData.metaDescription || ""}
                  onChange={(value) => updateField("metaDescription", value)}
                  error={errors.metaDescription}
                  maxLength={500}
                  showCounter
                  rows={3}
                  placeholder="Descrição otimizada para buscadores"
                  validate={(value) => (value ? validateField("metaDescription", value) : undefined)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {product ? "Atualizar" : "Criar"} Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
