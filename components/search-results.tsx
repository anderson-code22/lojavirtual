"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchProducts } from "@/lib/search"
import type { Product, SearchFilters } from "@/lib/types"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const brand = searchParams.get("brand") || ""
  const minPrice = searchParams.get("minPrice") || ""
  const maxPrice = searchParams.get("maxPrice") || ""
  const sortBy = searchParams.get("sortBy") || "relevance"

  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const itemsPerPage = 12

  useEffect(() => {
    handleSearch()
  }, [query, category, brand, minPrice, maxPrice, sortBy, currentPage])

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const filters: SearchFilters = {
        category: category || undefined,
        brand: brand || undefined,
        minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
        sortBy: sortBy as any,
        page: currentPage,
        limit: itemsPerPage,
      }

      const result = await searchProducts(query, filters)
      setProducts(result.products)
      setTotalCount(result.total)
    } catch (error) {
      console.error("Erro na busca:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header dos resultados */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{query ? `Resultados para "${query}"` : "Todos os produtos"}</h1>
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("sortBy", value)
            window.history.pushState(null, "", `?${params.toString()}`)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price_asc">Menor preço</SelectItem>
            <SelectItem value="price_desc">Maior preço</SelectItem>
            <SelectItem value="name_asc">Nome A-Z</SelectItem>
            <SelectItem value="name_desc">Nome Z-A</SelectItem>
            <SelectItem value="rating">Melhor avaliação</SelectItem>
            <SelectItem value="newest">Mais recentes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de produtos */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Anterior
              </Button>

              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h2>
          <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou usar termos diferentes na busca.</p>
          <Button onClick={() => (window.location.href = "/products")}>Ver todos os produtos</Button>
        </div>
      )}
    </div>
  )
}
