"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Não mostrar se já foi dispensado
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-prompt-dismissed")
    if (dismissed) {
      setShowPrompt(false)
    }
  }, [])

  if (!showPrompt || !deferredPrompt) return null

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-96 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Download className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Instalar EcoStore</h3>
            <p className="text-xs text-gray-600 mt-1">
              Adicione o app à sua tela inicial para acesso rápido e experiência melhorada
            </p>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" onClick={handleInstall} className="bg-green-600 hover:bg-green-700">
                Instalar
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                Agora não
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
