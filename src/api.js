import { API_BASE } from "./config";

const MENSAGENS = {
  400: "Dados inválidos (400). Confira os campos, ex.: nota entre 0 e 10.",
  401: "Não autenticado (401). Faça login novamente.",
  403: "Sem permissão (403). Esta ação exige o role ADMIN.",
  404: "Não encontrado (404). Confira o endpoint em src/config.js.",
};

export async function api(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(MENSAGENS[res.status] || `Erro ${res.status} ao chamar ${method} ${path}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
