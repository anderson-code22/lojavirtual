import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Entre na sua conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              crie uma nova conta
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
