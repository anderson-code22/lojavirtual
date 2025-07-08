import { RegisterForm } from "@/components/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crie sua conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              entre na sua conta existente
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
