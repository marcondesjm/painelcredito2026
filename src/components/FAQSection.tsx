import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Como funciona para gerar os créditos?",
      answer: "É bem simples! Você precisa copiar o link de convite da conta que deseja depositar os créditos e enviar esse link no nosso painel. Depois, selecione a quantidade de créditos desejada e seus créditos serão depositados automaticamente."
    },
    {
      question: "Como eu sei se funciona mesmo e não é golpe?",
      answer: <>Você pode pedir para nós enviarmos créditos para você para que você veja os resultados e o funcionamento por conta própria. <a href="https://wa.me/5548996029392?text=Olá! Gostaria de pedir uma demonstração do painel." target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Clique aqui para pedir uma demonstração.</a></>
    },
    {
      question: "Como funciona o acesso ao produto?",
      answer: "Após a confirmação do pagamento, será criado automaticamente um login utilizando o e-mail cadastrado na compra. Com esse login, você poderá acessar o painel diretamente pelo nosso site, na aba Painel. O acesso é liberado de forma automática e imediata."
    },
    {
      question: "Tem tutorial por vídeo e manual de acesso?",
      answer: "Sim! Temos tutorial em vídeo e manual de acesso completo. Clique aqui para acessar a página de tutorial."
    },
    {
      question: "Por quanto tempo terei acesso?",
      answer: "Você terá acesso vitalício ao painel, incluindo todas as atualizações futuras sem custo adicional."
    },
    {
      question: "Quais sistemas operacionais o programa funciona?",
      answer: "O painel funciona 100% online, direto no navegador. Acesse de qualquer dispositivo (Windows, Mac, Linux, Android, iOS)."
    },
    {
      question: "Tem limite de resgate de créditos?",
      answer: "Não há limite de resgates. Você pode gerar quantos créditos quiser, sem restrições."
    },
    {
      question: "Está funcionando depois da atualização do Lovable?",
      answer: "Sim, está funcionando depois do fix que a Lovable deu no método antigo das extensões que clicavam publish ao mesmo tempo. Nosso painel utiliza métodos diferentes e atualizados."
    },
    {
      question: "Funciona em uma conta que já indicou mais de 10 convites?",
      answer: "Sim! Você pode resgatar créditos em uma conta que já indicou mais de 10 pessoas, desde que você tenha acesso a uma conta que já resgatou créditos nessa conta, então você pode depositar na conta desejada."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 relative">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que <span className="text-primary">escolher</span> o painel?
          </h2>
          <p className="text-muted-foreground">
            Tudo você precisa para usar a Lovable sem preocupações.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="text-foreground font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
