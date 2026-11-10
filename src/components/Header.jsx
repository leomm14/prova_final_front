import { useAuth0 } from "@auth0/auth0-react";

export default function Header({ session }) {
  const { logout } = useAuth0();
  const { isAuthenticated, user, roles, isAdmin } = session;

  return (
    <header className="card header">
      <h1>Sistema de Avaliações</h1>
      {isAuthenticated && user && (
        <div className="user">
          {user.picture && <img src={user.picture} alt="" className="avatar" />}
          <div>
            <strong>{user.name}</strong>
            <div className="muted small">{user.email}</div>
          </div>
          <span className={`badge ${isAdmin ? "badge-admin" : ""}`}>{isAdmin ? "ADMIN" : roles[0] || "USER"}</span>
          <button className="btn" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
