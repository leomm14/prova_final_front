import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";
import { AUTH0 } from "./config";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={AUTH0.domain}
    clientId={AUTH0.clientId}
    authorizationParams={{
      audience: AUTH0.audience,
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
