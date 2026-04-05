**Central de Conhecimento e Suporte Inteligente**. Ele reflete as tecnologias que você está usando (React, Firebase, Tailwind) e as funcionalidades presentes nos seus componentes.

---

# 🛡️ Central de Conhecimento Inteligente

Uma plataforma completa de autoatendimento e suporte em tempo real, composta por um **Dashboard de Usuário** com busca inteligente e um **Painel Administrativo** para curadoria de conteúdo e chat de suporte.

## 🚀 Funcionalidades

### 👤 Área do Usuário
* **Busca em Tempo Real:** Pesquisa dinâmica na base de conhecimento com normalização de texto (ignora acentos e maiúsculas).
* **Sugestão de Conteúdo:** Caso a dúvida não seja encontrada, o usuário pode enviar a pergunta para análise da equipe técnica.
* **Chat de Suporte:** Comunicação direta com administradores via chat flutuante.
* **Autenticação:** Proteção de rotas e persistência de login via Firebase Auth.

### ⚙️ Painel Administrativo
* **Gestão de Pendências:** Visualização e resposta de perguntas enviadas por usuários que não encontraram solução na busca.
* **Curadoria da Base:** Interface para adicionar, editar e excluir itens da Base de Conhecimento oficial.
* **Central de Mensagens (Omnichannel):** Sistema de chat para atender múltiplos usuários simultaneamente com notificações de novas mensagens.
* **Paginação e Filtros:** Organização eficiente de grandes volumes de dados de suporte.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** [React.js](https://reactjs.org/) (Hooks, Context, Router v6)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & CSS Modules
* **Backend as a Service (BaaS):** [Firebase](https://firebase.google.com/)
    * **Firestore:** Banco de dados NoSQL em tempo real.
    * **Authentication:** Gestão de usuários e segurança.
* **Ícones/UI:** SVG dinâmicos e animações nativas do Tailwind.

## 📁 Estrutura de Pastas (Principais Componentes)

```text
src/
├── components/
│   ├── Admin/
│   │   ├── DashboardAdmin.js   # Gestão da base e pendências
│   │   ├── ChatAdmin.js        # Central de atendimento
│   │   └── Administrativo.css
│   ├── Usuario/
│   │   ├── DashboardUsuario.js # Interface de busca
│   │   ├── ChatUsuario.js      # Chat flutuante do cliente
│   │   └── PerguntaResultado.js
├── Config/
│   └── Firebase.js             # Configuração da SDK do Firebase
└── Header/                     # Navegação global
```

## 🔧 Configuração e Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Firebase:**
    Crie um arquivo em `src/Config/Firebase.js` e adicione suas credenciais:
    ```javascript
    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_PROJETO.firebaseapp.com",
      projectId: "SEU_PROJETO",
      storageBucket: "SEU_PROJETO.appspot.com",
      messagingSenderId: "ID",
      appId: "APP_ID"
    };
    ```

4.  **Inicie o projeto:**
    ```bash
    npm start
    ```

## 📊 Estrutura do Banco (Firestore)

* `base_conhecimento`: Documentos com `pergunta` e `resposta`.
* `perguntas_pendentes`: Tickets criados quando a busca não retorna resultados.
* `usuarios`: Dados de perfil para o chat.
* `chats/{usuarioId}/mensagens`: Subcoleção para o histórico de conversas em tempo real.

---
⭐ *Desenvolvido como parte do projeto de evolução técnica em Frontend (React/Firebase).*