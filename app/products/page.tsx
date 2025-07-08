import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos os Produtos</h1>
        <p className="text-muted-foreground">Descubra nossa coleção completa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters />
        </aside>
        <main className="lg:col-span-3">
          <ProductGrid />
        </main>
      </div>
    </div>
  )
}
