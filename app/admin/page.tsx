import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}
