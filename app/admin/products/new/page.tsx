import { ProductForm } from "@/components/admin/product-form"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function NewProductPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Novo Produto</h1>
        <ProductForm />
      </div>
    </AdminGuard>
  )
}
