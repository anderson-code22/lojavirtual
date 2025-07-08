import { OrdersManager } from "@/components/admin/orders-manager"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <OrdersManager />
      </div>
    </AdminGuard>
  )
}
