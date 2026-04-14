# 🏫 Controle de Turmas

Sistema de gerenciamento de escolas públicas e turmas desenvolvido em **React Native** com **Expo SDK 54**, tema visual **Medieval Dark** e arquitetura em camadas inspirada em DDD.

---

## Screenshots

### Dashboard

| Lista de Escolas | Busca por nome |
|:---:|:---:|
| _coloque seu print aqui_ | _coloque seu print aqui_ |

### Detalhes da Escola

| Turmas | Modal Nova Turma | Modal Editar Turma |
|:---:|:---:|:---:|
| _coloque seu print aqui_ | _coloque seu print aqui_ | _coloque seu print aqui_ |

### Formulários

| Cadastrar Escola | Editar Escola |
|:---:|:---:|
| _coloque seu print aqui_ | _coloque seu print aqui_ |

---

## ✨ Funcionalidades

- 🏫 **Escolas** — listar, buscar, criar, editar e excluir
- 📚 **Turmas** — listar por escola, criar, editar e excluir com seleção de turno (Matutino / Vespertino / Noturno)
- 🔍 **Busca em tempo real** com filtro por nome no dashboard
- 📊 **Resumo** de total de escolas vs. escolas exibidas
- 💾 **Cache offline** com AsyncStorage — padrão Stale-While-Revalidate
- 🎨 **Tema Medieval Dark** consistente em todas as telas

---

## 🛠 Stack

| Camada | Tecnologia |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navegação | Expo Router 6 (file-based routing) |
| Estado global | Context API + hooks tipados |
| Persistência | AsyncStorage 2.2 |
| Linguagem | TypeScript 5.9 |
| Testes | Jest 30 + Testing Library React Native 13 |
| Lint | ESLint 9 + eslint-config-expo |
| Runtime | Hermes Engine + New Architecture (Fabric) |

---

## 🗂 Estrutura do Projeto

```
controle-turmas/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx              # Dashboard — lista de escolas
│   ├── schools/
│   │   └── [id].tsx               # Detalhes da escola + turmas
│   └── _layout.tsx                # Root layout + SchoolsProvider + mock server
│
├── components/
│   ├── schools/
│   │   └── school-form-modal.tsx  # Modal criar/editar escola
│   └── turmas/
│       └── turma-form-modal.tsx   # Modal criar/editar turma
│
├── constants/
│   └── theme.ts                   # MedievalTheme — design tokens
│
├── hooks/
│   └── use-school-filter.ts       # Filtro de busca com useMemo
│
└── src/
    ├── domain/                    # Núcleo — sem dependências externas
    │   ├── entities/
    │   │   ├── school.ts          # Interface School + DTOs
    │   │   └── turma.ts           # Interface Turma + Turno + DTOs
    │   └── repositories/
    │       ├── schools.repository.ts
    │       └── turmas.repository.ts
    │
    ├── application/               # Casos de uso / orquestração
    │   └── contexts/
    │       ├── SchoolsContext.tsx  # Estado global de escolas (SWR)
    │       └── TurmasContext.tsx   # Estado de turmas por escola (SWR)
    │
    ├── infrastructure/            # Implementações substituíveis
    │   └── mocks/
    │       ├── data/
    │       │   ├── schools.data.ts
    │       │   └── turmas.data.ts
    │       ├── handlers/
    │       │   ├── schools.handlers.ts
    │       │   └── turmas.handlers.ts
    │       ├── types.ts           # RouteHandler, json(), uid()
    │       ├── handlers.ts        # Agrega todos os handlers
    │       ├── server.ts          # Interceptor de fetch (sem MSW)
    │       └── constants.ts       # API_BASE
    │
    └── __tests__/
        ├── domain/repositories/
        │   └── schools.repository.test.ts
        ├── application/contexts/
        │   └── schools-context.test.tsx
        └── hooks/
            └── use-school-filter.test.ts
```

---

## 🏛 Arquitetura

O projeto segue os princípios do **Domain-Driven Design (DDD)** com três camadas bem definidas onde a dependência flui em uma única direção:

```
infrastructure/  →  application/  →  domain/
(mocks, fetch)      (contexts)       (entities, repositories)
```

### Padrões aplicados

| Padrão | Onde |
|---|---|
| **Repository** | `SchoolsRepository`, `TurmasRepository` encapsulam todo acesso a dados |
| **Adapter** | `matchRoute()` adapta padrões de URL com `:param` para `RegExp` |
| **Stale-While-Revalidate** | Contextos servem cache do AsyncStorage e atualizam em background |
| **Provider / Consumer** | Context API com hooks tipados (`useSchools`, `useTurmas`) |

---

## ⚙️ Como rodar

### Versões utilizadas

| Ferramenta / Lib | Versão |
|---|---|
| Node.js | 18+ |
| Expo SDK | 54.0.33 |
| React Native | 0.81.5 |
| React | 19.1.0 |
| Expo Router | 6.0.23 |
| TypeScript | 5.9.2 |
| AsyncStorage | 2.2.0 |
| Jest | 30.3.0 |
| Testing Library RN | 13.3.3 |

### Pré-requisitos

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) **ou** Android Studio / Xcode para emulador

### Instalação

```bash
git clone <url-do-repositorio>
cd controle-turmas
npm install
```

### Executar

```bash
# Recomendado: limpa o cache do Metro antes de iniciar
npx expo start --clear

# Abre direto no emulador Android
npm run android

# Abre direto no simulador iOS
npm run ios
```

Após iniciar, escaneie o **QR Code** exibido no terminal com o app **Expo Go** para rodar no dispositivo físico.

### Testes

```bash
npm test                  # executa todos os testes (19/19)
npm run test:watch        # modo watch — re-executa ao salvar
npm run test:coverage     # gera relatório de cobertura em /coverage
```

---

## 🔌 Mock de Back-end

O projeto **não depende de nenhum servidor externo**. A API é simulada por um interceptor de `fetch` customizado, compatível com o runtime Hermes do React Native.

### Como funciona

1. Ao iniciar o app em modo desenvolvimento (`__DEV__ === true`), o `app/_layout.tsx` chama `startMockServer()` antes de renderizar qualquer tela
2. `startMockServer()` substitui o `global.fetch` por uma função que roteia as requisições para os handlers locais
3. Se nenhum handler bater com a URL, a requisição é repassada para o `fetch` original (bypass)

```
app/_layout.tsx
  └── startMockServer()          # ativa somente em __DEV__
        └── global.fetch = ...   # intercepta todas as chamadas fetch
              └── handlers/      # roteia para o handler correto
                    └── data/    # retorna dados em memória
```

### Endpoints simulados

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/schools` | Lista todas as escolas |
| `POST` | `/api/schools` | Cria uma escola |
| `PUT` | `/api/schools/:id` | Edita uma escola |
| `DELETE` | `/api/schools/:id` | Remove uma escola |
| `GET` | `/api/schools/:id/classes` | Lista turmas de uma escola |
| `POST` | `/api/schools/:id/classes` | Cria uma turma |
| `PUT` | `/api/classes/:id` | Edita uma turma |
| `DELETE` | `/api/classes/:id` | Remove uma turma |

### Dados iniciais (seed)

Os dados de exemplo ficam em `src/infrastructure/mocks/data/`:

- `schools.data.ts` — 2 escolas pré-cadastradas
- `turmas.data.ts` — 5 turmas distribuídas entre as escolas

> **Em produção**, basta substituir `src/domain/repositories/` para apontar para uma API real. Nenhuma outra camada precisa mudar.

---

## 🧪 Suíte de Testes

| Arquivo | Casos de Teste |
|---|---|
| `schools.repository.test.ts` | `findAll`, `create`, `update`, `delete`, `findById` — 6 casos |
| `schools-context.test.tsx` | estado inicial, `addSchool`, `deleteSchool`, `updateSchool`, erro sem Provider — 5 casos |
| `use-school-filter.test.ts` | busca vazia, por nome, case-insensitive, sem resultados, lista vazia — 8 casos |
| **Total** | **19 / 19 ✅** |

---

## 🎨 Tema Medieval Dark

Paleta centralizada em `constants/theme.ts` — importar `MedievalTheme` em qualquer componente:

| Token | Valor | Uso |
|---|---|---|
| `bg` | `#121212` | Fundo principal |
| `surface` | `#1E1E1E` | Sheets e modais |
| `card` | `#2A2A2A` | Cards de listagem |
| `gold` | `#C2A878` | Ações primárias e destaques |
| `textPrimary` | `#F5F5F5` | Texto principal |
| `textSecondary` | `#BDBDBD` | Texto de apoio e placeholders |
| `border` | `#3A3A3A` | Bordas e separadores |
| `accent` | `#8F7A66` | Badges e ícones secundários |

---

## 📄 Licença

Projeto desenvolvido para fins educacionais.
