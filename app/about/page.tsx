import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Truck, Shield } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Users,
      title: "Equipe Especializada",
      description: "Nossa equipe é formada por especialistas apaixonados por tecnologia e atendimento ao cliente.",
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Trabalhamos apenas com produtos originais e de alta qualidade das melhores marcas do mercado.",
    },
    {
      icon: Truck,
      title: "Entrega Rápida",
      description:
        "Entregamos em todo o Brasil com rapidez e segurança, com frete grátis para compras acima de R$ 200.",
    },
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Suas informações estão protegidas com criptografia de ponta e sistemas de segurança avançados.",
    },
  ]

  const stats = [
    { number: "50K+", label: "Clientes Satisfeitos" },
    { number: "500+", label: "Produtos Disponíveis" },
    { number: "5 Anos", label: "No Mercado" },
    { number: "4.9★", label: "Avaliação Média" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">Sobre a EcoStore</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Sua Loja de <span className="text-green-600">Confiança</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Há mais de 5 anos no mercado, a EcoStore se dedica a oferecer os melhores produtos de tecnologia com preços
            justos e atendimento excepcional. Nossa missão é tornar a tecnologia acessível para todos.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher a EcoStore?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos muito mais que produtos. Proporcionamos uma experiência completa de compra online com qualidade
              e confiança.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Acreditamos que a tecnologia deve ser acessível a todos. Por isso, trabalhamos incansavelmente para
                oferecer os melhores produtos com preços justos, atendimento personalizado e uma experiência de compra
                excepcional.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nosso compromisso vai além da venda: queremos ser seu parceiro de confiança em todas as suas
                necessidades tecnológicas, oferecendo suporte completo antes, durante e após a compra.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-8 text-center">
              <img
                src="/placeholder.svg?height=300&width=300"
                alt="Nossa equipe"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Transparência</h3>
              <p className="text-green-100">
                Preços claros, sem taxas ocultas. Você sempre sabe exatamente o que está pagando.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Qualidade</h3>
              <p className="text-green-100">
                Produtos originais e testados, com garantia e suporte técnico especializado.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Inovação</h3>
              <p className="text-green-100">
                Sempre em busca das últimas novidades para oferecer o que há de mais moderno.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
