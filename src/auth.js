import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ROLES_CLAIM } from "./config";

// Decodifica o payload do JWT (base64url + UTF-8)
export function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Sessão: usuário, access token e roles (lidos do próprio token)
export function useSession() {
  const { isAuthenticated, isLoading, user, error, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setToken(null);
      return;
    }
    let cancelled = false;
    getAccessTokenSilently()
      .then((t) => !cancelled && setToken(t))
      .catch((e) => console.error("Erro ao obter token:", e));
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  const payload = useMemo(() => (token ? decodeJwt(token) : null), [token]);
  const roles = payload?.[ROLES_CLAIM] ?? payload?.roles ?? [];

  return {
    isAuthenticated,
    isLoading,
    authError: error,
    user,
    token,
    payload,
    roles,
    isAdmin: roles.includes("ADMIN"),
  };
}
