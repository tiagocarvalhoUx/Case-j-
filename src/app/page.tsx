import {
  Gift,
  Users,
  Globe,
  Plane,
  LayoutDashboard,
  CalendarCheck,
  Store,
  ShieldCheck,
  Heart,
  ArrowRight,
  Check,
  Sparkles,
  PiggyBank,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HeroSlideshow } from "@/components/site/hero-slideshow";
import { SectionHeading } from "@/components/site/section-heading";
import { Container } from "@/components/ui/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: Globe,
    title: "Site do casamento personalizado",
    desc: "Escolha um tema, conte a história do casal, publique a galeria de fotos e as informações do grande dia — no ar em minutos.",
  },
  {
    icon: Gift,
    title: "Lista de presentes em dinheiro",
    desc: "Convidados escolhem presentes simbólicos que viram dinheiro direto na sua conta. Sem loja física, sem trocas.",
  },
  {
    icon: Plane,
    title: "Cotas de lua de mel",
    desc: "Monte a viagem dos sonhos em cotas e deixe cada convidado contribuir com o pedaço que quiser da lua de mel.",
  },
  {
    icon: Users,
    title: "Convidados e RSVP",
    desc: "Importe a lista, controle confirmações de presença em tempo real e organize as mesas sem planilhas.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel em tempo real",
    desc: "Acompanhe arrecadação, presenças confirmadas, mensagens e tarefas em um dashboard claro e intuitivo.",
  },
  {
    icon: CalendarCheck,
    title: "Cronograma de tarefas",
    desc: "Um checklist inteligente guia o planejamento mês a mês para que nada importante seja esquecido.",
  },
  {
    icon: Store,
    title: "Gestão de fornecedores",
    desc: "Centralize contatos, contratos e pagamentos de buffet, fotógrafo, decoração e todos os fornecedores.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamentos seguros",
    desc: "Pix, boleto e cartão parcelado processados via Asaas, com repasse direto para a conta dos noivos.",
  },
];

const steps = [
  {
    n: "01",
    title: "Crie seu site grátis",
    desc: "Cadastre-se, escolha um tema e personalize as cores, textos e fotos do casal em poucos cliques.",
  },
  {
    n: "02",
    title: "Monte sua lista",
    desc: "Adicione presentes em dinheiro e cotas de lua de mel. Você decide os valores e quem paga a taxa.",
  },
  {
    n: "03",
    title: "Compartilhe e receba",
    desc: "Envie o link aos convidados, acompanhe tudo pelo painel e receba o dinheiro direto na sua conta.",
  },
];

const plans = [
  {
    name: "Essencial",
    price: "Grátis",
    tagline: "Para começar a organizar",
    highlight: false,
    features: [
      "Site de casamento personalizável",
      "Lista de presentes em dinheiro",
      "Até 100 convidados com RSVP",
      "Cronograma de tarefas",
    ],
    cta: "Criar site grátis",
    fee: "Taxa de 4,9% por presente recebido",
  },
  {
    name: "Completo",
    price: "R$ 29",
    period: "/mês",
    tagline: "O favorito dos casais",
    highlight: true,
    features: [
      "Tudo do Essencial",
      "Convidados ilimitados + mesas",
      "Cotas de lua de mel",
      "Gestão de fornecedores",
      "Domínio próprio e sem anúncios",
    ],
    cta: "Assinar o Completo",
    fee: "Taxa regressiva: quanto mais arrecada, menor a taxa",
  },
];

const faqs = [
  {
    q: "Como o dinheiro dos presentes chega até nós?",
    a: "Cada presente ou cota comprado pelos convidados é convertido em dinheiro e repassado com segurança para a conta bancária dos noivos via Asaas, com Pix, boleto ou cartão parcelado.",
  },
  {
    q: "Quem paga as taxas da plataforma?",
    a: "Você escolhe. É possível embutir a taxa no valor do presente (o convidado paga) ou absorvê-la (os noivos pagam). No plano Completo, as taxas são regressivas conforme o volume arrecadado.",
  },
  {
    q: "Preciso saber programar para criar o site?",
    a: "Não. O editor é visual e simples: escolha um tema, troque textos, cores e fotos, e publique. Tudo funciona perfeitamente no celular, tablet e computador.",
  },
  {
    q: "Meus dados e os dos convidados estão protegidos?",
    a: "Sim. Seguimos a LGPD, usamos criptografia e nunca compartilhamos dados sem consentimento. Pagamentos são processados por gateway certificado, sem armazenar dados de cartão.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ================= HERO ================= */}
        <section className="relative flex min-h-[90vh] items-center overflow-hidden">
          {/* Fundo fotográfico em crossfade (Ken Burns) */}
          <HeroSlideshow />

          <Container className="py-20 lg:py-28">
            <div className="max-w-2xl animate-fade-up">
              <Badge variant="gold">
                <Sparkles size={14} /> Feito para noivos que amam simplicidade
              </Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                Planeje seu casamento{" "}
                <span className="text-gold-300">do jeito certo</span>, num só
                lugar.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                Site do casamento, lista de presentes que vira dinheiro, cotas de
                lua de mel e gestão de convidados. O Case-já cuida da organização
                para vocês aproveitarem cada momento.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/criar" className={buttonVariants({ size: "lg" })}>
                  Criar meu site grátis <ArrowRight size={18} />
                </a>
                <a
                  href="#como-funciona"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:shadow-none",
                  })}
                >
                  Ver como funciona
                </a>
              </div>

              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
                {[
                  ["+12 mil", "casais planejaram aqui"],
                  ["R$ 40M", "arrecadados em presentes"],
                  ["4,9/5", "avaliação dos noivos"],
                ].map(([stat, label]) => (
                  <div key={label}>
                    <dt className="font-display text-2xl font-semibold text-white">
                      {stat}
                    </dt>
                    <dd className="text-sm text-white/70">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        {/* ================= RECURSOS ================= */}
        <section id="recursos" className="py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Recursos"
              title="Uma plataforma para cada detalhe do grande dia"
              description="Do convite ao presente, o Case-já reúne todas as ferramentas que os casais mais valorizam — pensadas para serem simples de usar."
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <Card
                  key={f.title}
                  className="group hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <f.icon size={22} />
                  </span>
                  <CardTitle className="mt-5">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ================= COMO FUNCIONA ================= */}
        <section id="como-funciona" className="bg-surface-muted py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Como funciona"
              title="Do cadastro ao “sim” em 3 passos"
              description="Comece grátis e tenha tudo pronto para compartilhar com seus convidados no mesmo dia."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="relative">
                  <span className="font-display text-5xl font-semibold text-primary-200">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-navy-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ================= LISTA DE PRESENTES (destaque) ================= */}
        <section id="presentes" className="py-20 sm:py-28">
          <Container className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="O coração do Case-já"
                title={
                  <>
                    Presentes que viram{" "}
                    <span className="text-gradient-brand">
                      dinheiro de verdade
                    </span>
                  </>
                }
                description="Nada de eletrodoméstico repetido. Seus convidados presenteiam com carinho e você recebe o valor direto na conta, para usar como quiser."
              />
              <ul className="mt-8 space-y-4">
                {[
                  [
                    "Você define os valores",
                    "Crie presentes simbólicos e cotas de lua de mel com o valor que fizer sentido.",
                  ],
                  [
                    "Convidado paga como preferir",
                    "Pix, boleto ou cartão em até 12x — a experiência de compra é rápida e confiável.",
                  ],
                  [
                    "Controle das taxas",
                    "Escolha quem arca com a taxa e conte com tarifas regressivas conforme arrecada mais.",
                  ],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600">
                      <Check size={15} strokeWidth={3} />
                    </span>
                    <span>
                      <strong className="font-semibold text-navy-900">
                        {t}.
                      </strong>{" "}
                      <span className="text-ink-500">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="/criar"
                className={buttonVariants({ size: "lg", className: "mt-8" })}
              >
                Montar minha lista <ArrowRight size={18} />
              </a>
            </div>

            <GiftShowcase />
          </Container>
        </section>

        {/* ================= PREÇOS ================= */}
        <section id="precos" className="bg-surface-muted py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Preços"
              title="Comece grátis, pague só quando fizer sentido"
              description="Sem mensalidade obrigatória para começar. Você escolhe o plano ideal e as taxas são transparentes."
            />
            <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={
                    plan.highlight
                      ? "relative rounded-3xl border-2 border-primary-500 bg-white p-8 shadow-lg"
                      : "relative rounded-3xl border border-ink-200 bg-white p-8 shadow-sm"
                  }
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-8">
                      <Badge variant="brand">Mais popular</Badge>
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold text-navy-900">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-ink-500">{plan.tagline}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-display text-4xl font-semibold text-navy-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="mb-1 text-ink-500">{plan.period}</span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-ink-600">
                        <Check
                          size={18}
                          className="mt-0.5 shrink-0 text-primary-600"
                          strokeWidth={2.5}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/criar"
                    className={buttonVariants({
                      variant: plan.highlight ? "primary" : "outline",
                      className: "mt-8 w-full",
                    })}
                  >
                    {plan.cta}
                  </a>
                  <p className="mt-3 text-center text-xs text-ink-400">
                    {plan.fee}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="py-20 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              align="left"
              eyebrow="Dúvidas"
              title="Perguntas frequentes"
              description="Não achou o que procurava? Nossa equipe de suporte responde por chat, e-mail e telefone."
            />
            <div className="divide-y divide-ink-200 border-t border-ink-200">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900">
                    {f.q}
                    <span className="text-primary-500 transition-transform group-open:rotate-45">
                      <PlusIcon />
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="pb-8">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-16 text-center sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
              >
                <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-primary-500/40 blur-3xl" />
                <div className="absolute -right-10 bottom-[-4rem] h-64 w-64 rounded-full bg-gold-400/30 blur-3xl" />
              </div>
              <div className="relative">
                <Logo light className="mx-auto h-10 w-auto" />
                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                  Seu casamento organizado começa agora
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-navy-200">
                  Crie seu site em minutos, monte a lista de presentes e comece a
                  receber. É grátis para começar.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href="/criar"
                    className={buttonVariants({ variant: "gold", size: "lg" })}
                  >
                    Criar meu site grátis <Heart size={17} fill="currentColor" />
                  </a>
                  <a
                    href="/entrar"
                    className={buttonVariants({
                      size: "lg",
                      className:
                        "bg-white/10 text-white hover:bg-white/20 hover:shadow-none",
                    })}
                  >
                    Já tenho conta
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ---------- Ícone + (para o FAQ) ---------- */
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Showcase da lista de presentes ---------- */
function GiftShowcase() {
  const gifts = [
    { icon: Plane, name: "Passagem aérea", value: "R$ 1.200", pct: 80 },
    { icon: Heart, name: "Jantar romântico", value: "R$ 300", pct: 100 },
    { icon: PiggyBank, name: "Cota da lua de mel", value: "R$ 150", pct: 45 },
  ];
  return (
    <Card className="relative border-ink-200/70 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-navy-900">
          Nossa lista de presentes
        </h3>
        <Badge variant="success">
          <Check size={12} strokeWidth={3} /> Ativa
        </Badge>
      </div>
      <div className="mt-5 space-y-3">
        {gifts.map((g) => (
          <div
            key={g.name}
            className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-surface-muted/60 p-3"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <g.icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-navy-900">
                  {g.name}
                </p>
                <p className="text-sm font-semibold text-primary-600">
                  {g.value}
                </p>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                  style={{ width: `${g.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-5 w-full">
        Ver lista completa
      </Button>
    </Card>
  );
}
