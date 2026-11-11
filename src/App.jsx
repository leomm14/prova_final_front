import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSession } from "./auth";
import { api } from "./api";
import { ENDPOINT } from "./config";

export default function App() {
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, isLoading, token } = useSession();

  // um estado por campo: texto, número e data
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState("");

  const [objetos, setObjetos] = useState([]);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      setErro("");
      setObjetos((await api(ENDPOINT, { token })) ?? []);
    } catch (e) {
      setErro(e.message);
    }
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const enviar = async (e) => {
    e.preventDefault();
    try {
      setErro("");
      await api(ENDPOINT, {
        method: "POST",
        token,
        body: {
          nome, // string
          quantidade: Number(quantidade), // número
          dataEvento: data + "T00:00:00", // LocalDateTime. Se for LocalDate, use só: data
        },
      });
      setNome("");
      setQuantidade("");
      setData("");
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  if (!isAuthenticated) {
    return (
      <div className="box">
        <button onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    );
  }

  return (
    <div className="box">
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Sair</button>

      <form onSubmit={enviar}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="nome" required />
        <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="quantidade" required />
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
        <button type="submit">Enviar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <ul>
        {objetos.map((o) => (
          <li key={o.id}>
            {o.nome} — {o.quantidade} — {o.dataEvento ? new Date(o.dataEvento).toLocaleDateString("pt-BR") : "sem data"}
          </li>
        ))}
      </ul>
    </div>
  );
}