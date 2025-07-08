import { CategoryGrid } from "@/components/category-grid"
import { CategoryHero } from "@/components/category-hero"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <CategoryHero />
      <div className="container mx-auto px-4 py-16">
        <CategoryGrid />
      </div>
    </div>
  )
}
