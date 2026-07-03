import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";

const columns = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      { label: "Lista de presentes", href: "#presentes" },
      { label: "Preços", href: "#precos" },
      { label: "Modelos de site", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Blog do casamento", href: "#" },
      { label: "Contato", href: "#" },
      { label: "Trabalhe conosco", href: "#" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Perguntas frequentes", href: "#faq" },
      { label: "Segurança e pagamentos", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "#" },
      { label: "Privacidade (LGPD)", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200/70 bg-surface-muted">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              A plataforma completa para planejar seu casamento com
              simplicidade — do site à lista de presentes em dinheiro.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-navy-900">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-ink-500 transition-colors hover:text-primary-600"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink-200/70 pt-6 text-sm text-ink-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Case-já. Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
            Pagamentos processados com segurança via{" "}
            <span className="font-semibold text-ink-600">Asaas</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
