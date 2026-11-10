# Front esqueleto — Sistema de Avaliações

React + Vite + Auth0, com formulário (POST) e lista (GET) gerados a partir de `src/config.js`.

## Rodar local
```
npm install
npm run dev          # /api/* -> http://localhost:8080 (troque com VITE_API_TARGET em .env.local)
```

## O que mudar na prova (quase tudo em `src/config.js`)
1. `ENTITIES[].endpoint` → rota do enunciado (ex.: `/avaliacoes`)
2. `fields` → campos do formulário (`name` = nome do atributo no JSON do back)
3. `columns` → colunas da lista
4. `AUTH0` → se a prova usar outro tenant/app (ou use `.env.local`)
5. `ROLES_CLAIM` → se o namespace do claim de roles for outro
6. Apague a entidade "Objeto (genérico)" se não for usar

## Auth0 (Dashboard → Applications → sua SPA)
Adicione a URL da Vercel **e** `http://localhost:5173` em:
- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins

## Deploy automático (GitHub Actions → Vercel)
1. `npm i -g vercel && vercel login && vercel link` (gera `.vercel/project.json` com `orgId` e `projectId`)
2. GitHub → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Valor |
|---|---|
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `orgId` de `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` de `.vercel/project.json` |
| `API_URL` | `http://IP_DA_AWS:8080` (sem barra no final) |
| `VITE_AUTH0_*` (opcionais) | só se quiser trocar os padrões de `config.js` |

3. `git push` na `main` → o workflow `.github/workflows/deploy-front.yml` faz o deploy.

> O `vercel.json` tem `API_URL_PLACEHOLDER` de propósito: o workflow troca pelo secret `API_URL`.
> A Vercel é HTTPS e o back na AWS é HTTP; o rewrite `/api/*` evita erro de *mixed content* e de CORS.
