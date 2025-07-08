import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoStore - Sua Loja Online de Confiança",
    short_name: "EcoStore",
    description: "Encontre os melhores produtos de tecnologia com preços incríveis e entrega rápida",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["shopping", "business"],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  }
}
