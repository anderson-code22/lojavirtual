import { ProductsManager } from "@/components/admin/products-manager"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <ProductsManager />
      </div>
    </AdminGuard>
  )
}
