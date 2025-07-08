"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { getCategories, getBrands } from "@/lib/database"

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

export function SearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  useEffect(() => {
    loadFilters()
    loadCurrentFilters()
  }, [])

  const loadFilters = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([getCategories(), getBrands()])
      setCategories(categoriesData)
      setBrands(brandsData)
    } catch (error) {
      console.error("Erro ao carregar filtros:", error)
    }
  }

  const loadCurrentFilters = () => {
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    if (category) setSelectedCategories([category])
    if (brand) setSelectedBrands([brand])
    if (minPrice || maxPrice) {
      setPriceRange([minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 20000])
    }
  }

  const updateFilters = (newFilters: Record<string, string | string[] | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","))
      } else {
        params.set(key, value)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter((c) => c !== categorySlug)

    setSelectedCategories(newCategories)
    updateFilters({ category: newCategories.length > 0 ? newCategories[0] : undefined })
  }

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    const newBrands = checked ? [...selectedBrands, brandSlug] : selectedBrands.filter((b) => b !== brandSlug)

    setSelectedBrands(newBrands)
    updateFilters({ brand: newBrands.length > 0 ? newBrands[0] : undefined })
  }

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange)
    updateFilters({
      minPrice: newRange[0] > 0 ? newRange[0].toString() : undefined,
      maxPrice: newRange[1] < 20000 ? newRange[1].toString() : undefined,
    })
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 20000])

    const params = new URLSearchParams(searchParams.toString())
    const query = params.get("q")

    router.push(query ? `/search?q=${query}` : "/search")
  }

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (priceRange[0] > 0 || priceRange[1] < 20000 ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Filtros ativos */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filtros Ativos</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Limpar todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categorySlug) => {
                const category = categories.find((c) => c.slug === categorySlug)
                return category ? (
                  <Badge key={categorySlug} variant="secondary" className="flex items-center gap-1">
                    {category.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(categorySlug, false)} />
                  </Badge>
                ) : null
              })}

              {selectedBrands.map((brandSlug) => {
                const brand = brands.find((b) => b.slug === brandSlug)
                return brand ? (
                  <Badge key={brandSlug} variant="secondary" className="flex items-center gap-1">
                    {brand.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleBrandChange(brandSlug, false)} />
                  </Badge>
                ) : null
              })}

              {(priceRange[0] > 0 || priceRange[1] < 20000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  R$ {priceRange[0]} - R$ {priceRange[1]}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handlePriceChange([0, 20000])} />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtro por categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
              />
              <label
                htmlFor={category.slug}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filtro por marca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marcas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={brand.slug}
                checked={selectedBrands.includes(brand.slug)}
                onCheckedChange={(checked) => handleBrandChange(brand.slug, checked as boolean)}
              />
              <label
                htmlFor={brand.slug}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {brand.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filtro por preço */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={handlePriceChange} max={20000} step={100} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Filtro por avaliação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <label htmlFor={`rating-${rating}`} className="text-sm font-medium leading-none cursor-pointer">
                {rating} estrelas ou mais
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
