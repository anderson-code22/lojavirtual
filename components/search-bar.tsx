"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { searchProducts, getSearchSuggestions, saveSearchHistory } from "@/lib/search"
import type { Product } from "@/lib/types"

interface SearchBarProps {
  className?: string
  onClose?: () => void
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Carregar histórico de buscas
  useEffect(() => {
    const history = localStorage.getItem("searchHistory")
    if (history) {
      setRecentSearches(JSON.parse(history).slice(0, 5))
    }
  }, [])

  // Buscar produtos quando query muda
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      handleSearch(debouncedQuery)
    } else {
      setResults([])
      setSuggestions([])
    }
  }, [debouncedQuery])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const [productsResult, suggestionsResult] = await Promise.all([
        searchProducts(searchQuery, { limit: 6 }),
        getSearchSuggestions(searchQuery),
      ])

      setResults(productsResult.products)
      setSuggestions(suggestionsResult.slice(0, 4))
    } catch (error) {
      console.error("Erro na busca:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveSearchHistory(searchQuery)
      setRecentSearches((prev) => {
        const updated = [searchQuery, ...prev.filter((item) => item !== searchQuery)].slice(0, 5)
        localStorage.setItem("searchHistory", JSON.stringify(updated))
        return updated
      })

      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      onClose?.()
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setSuggestions([])
    setIsOpen(false)
  }

  const popularSearches = ["iPhone", "MacBook", "AirPods", "PlayStation", "Samsung Galaxy"]

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(query)
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={clearSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Sugestões de busca */}
            {suggestions.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Sugestões</h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="flex items-center w-full text-left p-2 hover:bg-muted rounded-md text-sm"
                      onClick={() => {
                        setQuery(suggestion)
                        handleSubmit(suggestion)
                      }}
                    >
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de produtos */}
            {results.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Produtos</h4>
                <div className="space-y-2">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      className="flex items-center w-full text-left p-2 hover:bg-muted rounded-md"
                      onClick={() => {
                        router.push(`/products/${product.id}`)
                        setIsOpen(false)
                        onClose?.()
                      }}
                    >
                      <img
                        src={product.image || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-sm text-green-600 font-semibold">R$ {product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {results.length >= 6 && (
                  <button
                    className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium mt-2 p-2"
                    onClick={() => handleSubmit(query)}
                  >
                    Ver todos os resultados
                  </button>
                )}
              </div>
            )}

            {/* Histórico de buscas */}
            {recentSearches.length > 0 && query.length === 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Buscas recentes
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="flex items-center w-full text-left p-2 hover:bg-muted rounded-md text-sm"
                      onClick={() => {
                        setQuery(search)
                        handleSubmit(search)
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buscas populares */}
            {query.length === 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Buscas populares
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-green-100 hover:text-green-700"
                      onClick={() => {
                        setQuery(search)
                        handleSubmit(search)
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Estado de loading */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Buscando...</p>
              </div>
            )}

            {/* Nenhum resultado */}
            {query.length >= 2 && !isLoading && results.length === 0 && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Nenhum resultado encontrado para "{query}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
