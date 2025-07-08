import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      details: ["(11) 9999-9999", "(11) 8888-8888"],
      description: "Segunda a Sexta, 8h às 18h",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contato@ecostore.com", "suporte@ecostore.com"],
      description: "Respondemos em até 24h",
    },
    {
      icon: MapPin,
      title: "Endereço",
      details: ["Rua das Flores, 123", "São Paulo - SP, 01234-567"],
      description: "Showroom aberto ao público",
    },
    {
      icon: Clock,
      title: "Horário de Funcionamento",
      details: ["Segunda a Sexta: 8h às 18h", "Sábado: 9h às 14h"],
      description: "Domingo: Fechado",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Entre em <span className="text-green-600">Contato</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou envie uma mensagem usando o
            formulário.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-900 font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Envie uma Mensagem</h2>
              <p className="text-gray-600 mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato com você o mais breve possível.
              </p>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Localização</h2>
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-6">
                <div className="text-center text-gray-600">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Mapa interativo em breve</p>
                  <p className="text-sm">Rua das Flores, 123 - São Paulo, SP</p>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Visite nosso Showroom</h3>
                  <p className="text-gray-600 mb-4">
                    Conheça nossos produtos pessoalmente em nosso showroom. Nossa equipe especializada está pronta para
                    ajudar você a encontrar o produto ideal.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Estacionamento:</strong> Gratuito para clientes
                    </p>
                    <p>
                      <strong>Acessibilidade:</strong> Local adaptado para PCD
                    </p>
                    <p>
                      <strong>Transporte:</strong> Próximo ao metrô e linhas de ônibus
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600">Confira as respostas para as dúvidas mais comuns</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">Qual o prazo de entrega?</h3>
              <p className="text-gray-600 mb-6">
                O prazo varia de acordo com sua localização. Para São Paulo capital, entregamos em até 24h. Para outras
                regiões, de 2 a 7 dias úteis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Posso trocar ou devolver?</h3>
              <p className="text-gray-600 mb-6">
                Sim! Você tem até 7 dias para trocar ou devolver produtos sem uso, conforme o Código de Defesa do
                Consumidor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Os produtos têm garantia?</h3>
              <p className="text-gray-600 mb-6">
                Todos os produtos possuem garantia do fabricante. Além disso, oferecemos suporte técnico especializado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Quais formas de pagamento?</h3>
              <p className="text-gray-600 mb-6">
                Aceitamos cartões de crédito, débito, PIX e boleto bancário. Parcelamos em até 12x sem juros no cartão.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
