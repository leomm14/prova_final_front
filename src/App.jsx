import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSession } from "./auth";
import { api } from "./api";
import { ENDPOINT } from "./config";

export default function App() {
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, isLoading, token } = useSession();

  // um estado por campo: texto, inteiro e data
  const [email, setEmail] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      setErro("");
      setTarefas((await api(ENDPOINT, { token })) ?? []);
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
          email,
          titulo, 
          descricao,
          prioridade: parseInt(prioridade, 10), // int
        },
      });
      setEmail("");
      setTitulo("");
      setDescricao("");
      setPrioridade("");
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  const apagar = async (id) => {
    try {
      setErro("");
      await api(`${ENDPOINT}/${id}`, { method: "DELETE", token });
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  if (!isAuthenticated) {
    return (
      <div className="box">
        <h1>Tarefas</h1>
        <button onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    );
  }

  return (
    <div className="box">
      <h1>Tarefas</h1>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Sair</button>

      <form onSubmit={enviar}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" required />
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="titulo" required />
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="descricao" required />
        <input type="number" step="1" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} placeholder="prioridade" required />
        <button type="submit">Enviar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <ul>
        {tarefas.map((o) => (
          <li key={o.id}>
            {o.nome} <button onClick={() => apagar(o.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}