import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ecostore.vercel.app"

  // Buscar produtos do banco
  const { data: products } = await supabase.from("products").select("id, slug, updated_at").eq("active", true)

  // Buscar categorias
  const { data: categories } = await supabase.from("categories").select("id, slug, updated_at").eq("active", true)

  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  // URLs de produtos
  const productUrls =
    products?.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })) || []

  // URLs de categorias
  const categoryUrls =
    categories?.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || []

  return [...staticUrls, ...productUrls, ...categoryUrls]
}
