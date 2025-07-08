import { CategoriesManager } from "@/components/admin/categories-manager"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <CategoriesManager />
      </div>
    </AdminGuard>
  )
}
