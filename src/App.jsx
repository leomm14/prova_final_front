import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSession } from "./auth";
import { ENTITIES } from "./config";
import Header from "./components/Header";
import EntityPanel from "./components/EntityPanel";

export default function App() {
  const session = useSession();
  const { loginWithRedirect } = useAuth0();
  const [activeId, setActiveId] = useState(ENTITIES[0].id);
  const entity = ENTITIES.find((e) => e.id === activeId) ?? ENTITIES[0];

  return (
    <div className="container">
      <Header session={session} />

      {session.authError && <div className="alert alert-error">Erro de login: {session.authError.message}</div>}

      {session.isLoading ? (
        <div className="card">Carregando...</div>
      ) : !session.isAuthenticated ? (
        <div className="card center">
          <h2>Bem-vindo</h2>
          <p className="muted">Faça login para ver e cadastrar.</p>
          <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
            Entrar
          </button>
        </div>
      ) : (
        <>
          {ENTITIES.length > 1 && (
            <nav className="tabs">
              {ENTITIES.map((e) => (
                <button
                  key={e.id}
                  className={`tab ${e.id === entity.id ? "active" : ""}`}
                  onClick={() => setActiveId(e.id)}
                >
                  {e.titulo}
                </button>
              ))}
            </nav>
          )}
          <EntityPanel key={entity.id} entity={entity} session={session} />
        </>
      )}
    </div>
  );
}
