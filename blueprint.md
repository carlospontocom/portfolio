# Blueprint do Portfólio

## Visão Geral do Projeto

Este documento detalha a arquitetura, funcionalidades e o processo de desenvolvimento de um portfólio web moderno e interativo. O objetivo é apresentar de forma clara e profissional as habilidades, projetos e a trajetória de um **Desenvolvedor Frontend com Conhecimento Full Stack**, com foco especial em React, Node.js (Básico) e Firebase.

O design foi concebido para ser clean, atraente e totalmente responsivo, proporcionando uma experiência de usuário de alta qualidade em qualquer dispositivo.

---

## Funcionalidades e Design Implementados

### 1. **Seção Hero (Apresentação)**
- **Propósito:** Causar um primeiro impacto forte, resumindo as competências e a experiência do desenvolvedor.
- **Design:**
    - Layout de duas colunas, adaptável para dispositivos móveis.
    - Título principal ajustado para "Desenvolvedor Frontend + Backend Básico".
    - Uso de ícones (React Icons, Simple Icons) para ilustrar tecnologias.
    - Cards informativos para destacar "Formação Acadêmica", "Stack Completa" e "Experiência Profissional".
- **Tecnologias:** React, Tailwind CSS.

### 2. **Seção de Projetos**
- **Propósito:** Exibir os projetos mais relevantes de forma organizada e interativa.
- **Design:**
    - Layout em grid com cards e um componente `Modal` para detalhes.
    - O `Modal` apresenta uma descrição aprofundada, tecnologias e funcionalidades de cada projeto.
- **Projetos Listados:**
    1.  **Agendamento Online:** Focado em gestão de horários (sem pagamento).
    2.  **Blog Platform:** Plataforma de conteúdo com sistema de comentários e dashboard.
    3.  **Checklist App:** App de produtividade com sincronização em tempo real.
- **Tecnologias:** React, Tailwind CSS, State Management (useState).

### 3. **Seção de Contato e Rodapé**
- **Propósito:** Oferecer um meio de comunicação e finalizar a página com informações de contato.
- **Tecnologias:** React, Tailwind CSS.

---

## Plano de Alterações Recentes

### Solicitação 1: Refinamento de Stack e Foco em React
- **Ações:**
    - Removida a funcionalidade de pagamento (`Payment API`) do projeto "Agendamento Online".
    - Eliminadas todas as referências a `Vue.js` e `Angular` do projeto, focando a apresentação das habilidades em React.
- **Resultado:** O portfólio passou a refletir com mais precisão o stack principal do desenvolvedor.

### Solicitação 2: Ajuste de Terminologia Profissional
- **Ações:**
    - Substituído "Desenvolvedor Full Stack" por "Desenvolvedor Frontend + Backend Básico".
    - Alterado "Node.js" para "Node.js (Básico)" em todas as menções.
    - Substituído "Pós-graduado" por "Pós-graduando" em todas as menções.
- **Resultado:** A descrição profissional foi ajustada para refletir com maior exatidão a especialização e o status acadêmico do desenvolvedor.

### Solicitação 3: Destaque Visual para Frontend
- **Arquivo Alvo:** `src/Componentes/Hero/index.jsx`.
- **Ação:** Adicionada uma cor de fundo azul (`bg-blue-100`) e texto escuro (`text-blue-800`) ao card da categoria "Frontend" na seção "Stack Completa".
- **Resultado:** Criada uma identidade visual mais forte para a principal área de especialização do desenvolvedor, associando-a à cor do ecossistema React.

### Solicitação 4: Refinamento do Card de Estatísticas
- **Arquivo Alvo:** `src/Componentes/Hero/index.jsx`.
- **Ação:** Substituído o rótulo "Certificações" por "Conhecimentos" no card de estatísticas.
- **Resultado:** O termo passou a refletir de forma mais abrangente e precisa as habilidades do desenvolvedor.

### Solicitação 5: Ajuste Fino no Projeto "Blog Platform"
- **Arquivo Alvo:** `src/Componentes/Projetos/index.jsx`.
- **Ação:** Removida a menção à funcionalidade "Editor de Texto Rico" para alinhar a descrição com o escopo real do projeto.
- **Resultado:** A descrição do projeto "Blog Platform" agora reflete com precisão suas funcionalidades, evitando qualquer ambiguidade.
