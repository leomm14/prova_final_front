// Tudo que muda na prova está aqui.

export const AUTH0 = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "dev-vlbhbshl7b1pxe8e.us.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "Crpd23BOSB8wodfqgphMHA16oteWzVK2",
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://dev-vlbhbshl7b1pxe8e.us.auth0.com/api/v2/",
};

export const ROLES_CLAIM = "https://social-insper.com/roles";

export const API_BASE = "/api";
export const ENDPOINT = "/objetos"; // <-- rota do back na prova
