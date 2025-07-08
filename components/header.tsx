"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { SearchBar } from "@/components/search-bar"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl">EcoStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Produtos
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categorias
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contato
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-4 w-4" />
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2">
                  <img
                    src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                    Início
                  </Link>
                  <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                    Produtos
                  </Link>
                  <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                    Categorias
                  </Link>
                  <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                    Sobre
                  </Link>
                  <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                    Contato
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
}
