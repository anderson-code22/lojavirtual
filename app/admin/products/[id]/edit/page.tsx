import { ProductForm } from "@/components/admin/product-form"
import { AdminGuard } from "@/components/admin/admin-guard"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Editar Produto</h1>
        <ProductForm productId={params.id} />
      </div>
    </AdminGuard>
  )
}
