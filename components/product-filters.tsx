"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Smartphones", "Laptops", "Áudio", "Smartwatches", "Câmeras", "Games"].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={50} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <label htmlFor={`rating-${rating}`} className="text-sm font-medium leading-none">
                {rating} estrelas ou mais
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full bg-transparent">
        Limpar Filtros
      </Button>
    </div>
  )
}
