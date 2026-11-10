// =====================================================================
//  ESTE É O ARQUIVO QUE VOCÊ EDITA NA PROVA.
//  Auth0, rota da API e campos do formulário ficam todos aqui.
// =====================================================================

// ---------- Auth0 ----------
// Valores padrão = tenant do professor. Para trocar: .env.local ou VITE_* no build.
// (domain/clientId/audience são públicos em SPA, não são segredo)
export const AUTH0 = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "dev-vlbhbshl7b1pxe8e.us.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "Crpd23BOSB8wodfqgphMHA16oteWzVK2",
  audience:
    import.meta.env.VITE_AUTH0_AUDIENCE || "https://dev-vlbhbshl7b1pxe8e.us.auth0.com/api/v2/",
};

// Claim onde o Auth0 coloca os roles (mesma usada no back: WebSecurityConfig/Controller)
export const ROLES_CLAIM = "https://social-insper.com/roles";

// Prefixo das chamadas. Em dev o Vite faz proxy; em prod o vercel.json faz rewrite.
export const API_BASE = "/api";

// ---------- Entidades ----------
// Cada item vira uma aba com formulário (POST) + lista (GET).
//
// Tipos de campo: text | email | number | textarea | select | datetime-local | checkbox
//   - select: use `options` (lista fixa) OU `optionsFrom` (busca em outro endpoint)
//   - valueType: "number" converte o valor para número antes de enviar
//   - fixed: valores fixos enviados sempre no POST (ex.: { tipo: "AVALIACAO" })
//   - createRole: role exigido para ver o formulário (null = qualquer logado)
const NOTAS_0_A_10 = Array.from({ length: 11 }, (_, i) => ({ value: i, label: String(i) }));

export const ENTITIES = [
  {
    id: "avaliacoes",
    titulo: "Avaliações",
    singular: "Avaliação",
    endpoint: "/objetos", // <-- na prova troque para "/avaliacoes"
    createRole: "ADMIN",
    fixed: {},
    // Mapeia a Avaliação do enunciado nos campos do Objeto genérico do back.
    // Na prova, se a entidade tiver os nomes do enunciado, troque os `name` aqui.
    fields: [
      {
        name: "emailDestino", // email do avaliado
        label: "Avaliado",
        type: "select",
        required: true,
        placeholder: "Escolha quem será avaliado",
        options: ["ana@empresa.com", "bruno@empresa.com", "carla@empresa.com"],
        // alternativa dinâmica:
        // optionsFrom: { endpoint: "/usuarios", value: "email", label: "nome" },
      },
      { name: "nota", label: "Nota (0 a 10)", type: "select", valueType: "number", required: true, options: NOTAS_0_A_10 },
      { name: "comentario", label: "Comentários", type: "textarea", placeholder: "Escreva sua avaliação..." },
      { name: "dataEvento", label: "Data da avaliação", type: "datetime-local" },
      // O email do avaliador (emailCriador) o back preenche sozinho a partir do token.
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "emailCriador", label: "Avaliador" },
      { key: "emailDestino", label: "Avaliado" },
      { key: "nota", label: "Nota" },
      { key: "comentario", label: "Comentários" },
      { key: "dataEvento", label: "Data", format: "datetime" },
    ],
  },

  // Exemplo "tudo que o Objeto tem" — útil para copiar campos. Apague se não precisar.
  {
    id: "objetos",
    titulo: "Objeto (genérico)",
    singular: "Objeto",
    endpoint: "/objetos",
    createRole: "ADMIN",
    fixed: {},
    fields: [
      { name: "nome", label: "Nome", type: "text" },
      { name: "titulo", label: "Título", type: "text" },
      { name: "descricao", label: "Descrição", type: "textarea" },
      { name: "categoria", label: "Categoria", type: "select", options: ["A", "B", "C"], placeholder: "Escolha..." },
      { name: "tipo", label: "Tipo", type: "text" },
      { name: "emailDestino", label: "Email destino", type: "email" },
      { name: "cpf", label: "CPF", type: "text" },
      { name: "nota", label: "Nota (0 a 10)", type: "number", valueType: "number" },
      { name: "quantidade", label: "Quantidade", type: "number", valueType: "number" },
      { name: "valor", label: "Valor", type: "number", valueType: "number" },
      { name: "ativo", label: "Ativo", type: "checkbox", defaultValue: true },
      { name: "dataEvento", label: "Data do evento", type: "datetime-local" },
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "nome", label: "Nome" },
      { key: "titulo", label: "Título" },
      { key: "categoria", label: "Categoria" },
      { key: "nota", label: "Nota" },
      { key: "emailCriador", label: "Criador" },
      { key: "dataCriacao", label: "Criado em", format: "datetime" },
    ],
  },
];
