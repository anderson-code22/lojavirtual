import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16 bg-green-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Receba Ofertas Exclusivas</h2>
        <p className="text-green-100 mb-8 max-w-2xl mx-auto">
          Inscreva-se em nossa newsletter e seja o primeiro a saber sobre promoções, novos produtos e ofertas especiais.
        </p>

        <div className="max-w-md mx-auto flex space-x-2">
          <Input type="email" placeholder="Seu melhor email" className="bg-white" />
          <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
            Inscrever
          </Button>
        </div>
      </div>
    </section>
  )
}
