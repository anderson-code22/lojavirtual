import { SearchResults } from "@/components/search-results"
import { SearchFilters } from "@/components/search-filters"
import { Suspense } from "react"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Carregando filtros...</div>}>
            <SearchFilters />
          </Suspense>
        </aside>
        <main className="lg:col-span-3">
          <Suspense fallback={<div>Carregando resultados...</div>}>
            <SearchResults />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
