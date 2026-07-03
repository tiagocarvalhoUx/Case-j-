# Prompt para SaaS de Casamentos

## 📋 Estrutura do Prompt

### 1. FUNDAÇÃO - Contexto

**Persona:** Futuros noivos e noivas que buscam uma plataforma digital completa para planejar e organizar seu casamento de forma eficiente e personalizada.

**Escopo:** Desenvolver um SaaS (Software as a Service) de casamentos que ofereça ferramentas abrangentes para o planejamento da festa, com foco especial na gestão de lista de presentes (com opção de conversão para dinheiro), gerenciamento de convidados, e personalização do evento. A IA atuará como um **Engenheiro de Prompts**, **Engenheiro de Software**, **Especialista em UI/UX Design** e **Consultor de Tecnologias Front/Backend** para guiar o desenvolvimento.

**Papel da IA:** A IA deve atuar como um guia especializado, fornecendo insights técnicos, sugestões de design e otimizações de software para a criação do SaaS. A IA deve ser proativa em identificar oportunidades de melhoria e em solicitar informações adicionais para garantir a completude e a qualidade do projeto.

### 2. Objetivo Direto

O objetivo principal é criar um prompt detalhado e acionável para o desenvolvimento de um SaaS de casamentos. Este prompt deve contemplar as funcionalidades essenciais para que os casais possam planejar e gerenciar todos os aspectos do seu casamento, com ênfase em uma lista de presentes flexível (dinheiro/produtos) e ferramentas de organização robustas, inspiradas nas melhores práticas do mercado, como as observadas no iCasei.

### 3. ENTRADA & SAÍDA - I/O

**Entrada:**
*   As regras de criação de prompts fornecidas pelo usuário (Regra de Ouro).
*   A análise das funcionalidades do site iCasei (lista de presentes em dinheiro, gerenciamento de convidados, personalização do site, sistema de pagamento próprio, tarifas regressivas, suporte ao cliente, etc.).
*   Informações adicionais que serão solicitadas ao usuário sobre tecnologias preferenciais (Front-end, Back-end), design system e requisitos específicos.

**Saída:**
Um prompt de comando completo, estruturado em Markdown, contendo as seguintes seções:
*   **Estrutura do Prompt:** Detalhando o contexto, persona e escopo.
*   **Objetivos Claros:** Descrevendo o que o SaaS deve realizar.
*   **Configurações Técnicas:** Sugestões de tecnologias e abordagens de desenvolvimento.
*   **Funcionalidades Essenciais:** Lista detalhada das características do SaaS.
*   **Regra de Ouro Aplicada:** Demonstração de como os princípios da Regra de Ouro foram incorporados.

### 4. Formato de Saída

O prompt será entregue em formato Markdown, com seções e subseções claras para facilitar a leitura e a compreensão. A estrutura será explícita e previsível, seguindo o padrão de 3 seções principais (Estrutura do Prompt, Objetivos Claros, Configurações Técnicas) conforme as instruções iniciais do usuário, expandindo-as com as funcionalidades e detalhes técnicos.

### 5. GUARD RAILS - Qualidade

**Critérios de Aceitação:**
*   O prompt deve ser abrangente, cobrindo as principais funcionalidades de um SaaS de casamentos, incluindo as inspiradas no iCasei.
*   Deve ser claro, conciso e sem ambiguidades.
*   Deve seguir rigorosamente as diretrizes da "Regra de Ouro" para criação de prompts.
*   Deve ser tecnicamente viável e orientar o desenvolvimento de um produto escalável e seguro.
*   Deve incluir considerações de UI/UX para uma experiência de usuário intuitiva e agradável.

**Tratamento de Ambiguidade e Erros:**
Em caso de informações incompletas ou ambíguas por parte do usuário, a IA deverá solicitar esclarecimentos específicos para garantir que o prompt final seja o mais preciso possível. Se uma solicitação estiver fora do escopo inicial, a IA deverá propor alternativas ou ajustes.

### 6. Proibições Necessárias

*   Não assumir tecnologias de desenvolvimento (Front-end, Back-end) sem a confirmação explícita do usuário.
*   Não incluir funcionalidades que violem a privacidade dos usuários ou que não estejam em conformidade com as leis de proteção de dados (LGPD no Brasil, GDPR na Europa, etc.).
*   Não criar funcionalidades que exijam acesso a informações financeiras sensíveis sem a implementação de rigorosos padrões de segurança e conformidade.
*   Não gerar código ou designs que não considerem a responsividade para diferentes dispositivos (desktop, tablet, mobile).

## 🎯 Objetivos Claros para o SaaS de Casamentos

O SaaS de Casamentos deve permitir que os casais:

1.  **Criem e personalizem um site de casamento:** Com temas e layouts adaptáveis, informações sobre o evento, galeria de fotos, e mensagens para os convidados.
2.  **Gerenciem a lista de convidados:** Com ferramentas para adicionar, editar, importar convidados, controlar RSVPs e organizar mesas.
3.  **Criem uma lista de presentes flexível:**
    *   **Lista de presentes virtuais:** Onde os convidados podem "comprar" presentes simbólicos que são convertidos em dinheiro para os noivos.
    *   **Opção de cotas de lua de mel:** Permite que os convidados contribuam financeiramente para a viagem dos noivos.
    *   **Sistema de pagamento integrado:** Seguro e eficiente, permitindo parcelamento para os convidados e depósito direto na conta dos noivos.
    *   **Controle de tarifas:** Opção para os noivos escolherem quem arca com a tarifa (noivos ou convidados) e tarifas regressivas baseadas no volume arrecadado.
4.  **Acompanhem o planejamento em tempo real:** Dashboard intuitivo para visualizar o status da lista de presentes, RSVPs, mensagens e outras métricas importantes.
5.  **Tenham acesso a suporte:** Canais de atendimento eficientes para noivos e convidados (chat, e-mail, telefone).
6.  **Gerenciem fornecedores:** Uma seção para listar e organizar os fornecedores contratados para o casamento.
7.  **Criem um cronograma de tarefas:** Para auxiliar no planejamento e garantir que nada seja esquecido.

## 🔧 Configurações Técnicas Sugeridas

Para o desenvolvimento do SaaS de Casamentos, as seguintes configurações técnicas são sugeridas, mas estarão sujeitas à validação e preferência do usuário:

**Arquitetura:** Microserviços para escalabilidade e manutenção.

**Front-end:**
*   **Framework:** React (com Next.js para SSR/SSG e otimização de SEO) ou Vue.js (com Nuxt.js).
*   **Linguagem:** TypeScript para robustez e manutenibilidade.
*   **Estilização:** Tailwind CSS para desenvolvimento rápido e consistente, ou Styled Components para modularidade.
*   **Design System:** Implementação de um design system customizado para garantir consistência visual e de UX.

**Back-end:**
*   **Linguagem/Framework:** Node.js (com Express.js ou NestJS para arquitetura modular) ou Python (com Django ou FastAPI).
*   **Banco de Dados:** PostgreSQL para dados relacionais (escalável e robusto) e, possivelmente, Redis para caching e sessões.
*   **Autenticação:** OAuth 2.0 e JWT para segurança e flexibilidade.
*   **Sistema de Pagamento:** Integração com gateways de pagamento robustos (ex: Stripe, PagSeguro, Mercado Pago) ou desenvolvimento de um sistema próprio conforme a complexidade e requisitos de negócio.
*   **Armazenamento de Arquivos:** AWS S3 ou Google Cloud Storage para armazenamento de imagens e outros arquivos.
*   **APIs:** RESTful APIs para comunicação entre Front-end e Back-end.

**Infraestrutura:**
*   **Cloud Provider:** AWS, Google Cloud Platform ou Azure para escalabilidade, segurança e serviços gerenciados.
*   **Containerização:** Docker para empacotamento e isolamento de aplicações.
*   **Orquestração:** Kubernetes para gerenciamento de containers em produção.

**DevOps:**
*   **CI/CD:** GitHub Actions, GitLab CI/CD ou Jenkins para automação de testes e deploy.
*   **Monitoramento:** Prometheus e Grafana para monitoramento de performance e logs.

**UI/UX:**
*   **Pesquisa de Usuário:** Realização de entrevistas e testes de usabilidade com casais para validar as funcionalidades e o fluxo de usuário.
*   **Wireframes e Protótipos:** Criação de wireframes de baixa e alta fidelidade e protótipos interativos para validação do design antes do desenvolvimento.
*   **Acessibilidade:** Garantir que o SaaS seja acessível para todos os usuários, seguindo as diretrizes WCAG.
*   **Design Responsivo:** Otimização da interface para diferentes tamanhos de tela e dispositivos.

Este prompt serve como base para iniciar o desenvolvimento do SaaS de Casamentos. As tecnologias e funcionalidades específicas serão refinadas com base nas interações e decisões do usuário.
