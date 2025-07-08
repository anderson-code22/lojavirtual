import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { Newsletter } from "@/components/newsletter"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </div>
  )
}
