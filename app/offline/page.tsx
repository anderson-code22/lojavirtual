"use client"

import { Wifi, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Wifi className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Você está offline</h1>
          <p className="text-gray-600">
            Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
          </p>
        </div>

        <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">Enquanto isso, você pode:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Verificar sua conexão Wi-Fi</li>
            <li>• Verificar seus dados móveis</li>
            <li>• Tentar novamente em alguns minutos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
