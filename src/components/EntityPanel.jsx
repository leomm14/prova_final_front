import { useCallback, useEffect, useState } from "react";
import { api } from "../api";

const normalize = (o) => (typeof o === "object" && o !== null ? o : { value: o, label: String(o) });

const initialValues = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? (f.type === "checkbox" ? false : "")]));

// datetime-local ("2026-11-10T14:30") -> LocalDateTime do Java ("2026-11-10T14:30:00")
const toLocalDateTime = (v) => (v.length === 16 ? `${v}:00` : v);

const formatCell = (item, col) => {
  if (col.render) return col.render(item);
  const v = item[col.key];
  if (v === null || v === undefined || v === "") return "—";
  if (col.format === "datetime") {
    const d = new Date(v);
    return isNaN(d) ? String(v) : d.toLocaleString("pt-BR");
  }
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  return String(v);
};

export default function EntityPanel({ entity, session }) {
  const { token } = session;
  const canCreate = !entity.createRole || session.roles.includes(entity.createRole);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [values, setValues] = useState(() => initialValues(entity.fields));
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setItems((await api(entity.endpoint, { token })) ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [entity.endpoint, token]);

  useEffect(() => {
    load();
  }, [load]);

  // Selects com optionsFrom: busca as opções em outro endpoint
  useEffect(() => {
    if (!token) return;
    entity.fields
      .filter((f) => f.optionsFrom)
      .forEach(async (f) => {
        try {
          const data = (await api(f.optionsFrom.endpoint, { token })) ?? [];
          setDynamicOptions((prev) => ({
            ...prev,
            [f.name]: data.map((d) => ({ value: d[f.optionsFrom.value], label: d[f.optionsFrom.label] })),
          }));
        } catch (e) {
          setError(e.message);
        }
      });
  }, [entity.fields, token]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => {
    const payload = { ...entity.fixed };
    for (const f of entity.fields) {
      const v = values[f.name];
      if (v === "" || v === undefined) continue;
      if (f.type === "checkbox") payload[f.name] = v;
      else if (f.type === "datetime-local") payload[f.name] = toLocalDateTime(v);
      else if (f.valueType === "number" || f.type === "number") payload[f.name] = Number(v);
      else payload[f.name] = v;
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api(entity.endpoint, { method: "POST", token, body: buildPayload() });
      setSuccess(`${entity.singular} cadastrada com sucesso!`);
      setValues(initialValues(entity.fields));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (f) => {
    const common = { id: f.name, name: f.name, onChange: handleChange, required: !!f.required };

    if (f.type === "select") {
      const opts = (f.options ?? dynamicOptions[f.name] ?? []).map(normalize);
      return (
        <select {...common} value={values[f.name]}>
          <option value="">{f.placeholder || "Selecione..."}</option>
          {opts.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    if (f.type === "textarea")
      return <textarea {...common} rows={3} value={values[f.name]} placeholder={f.placeholder} />;
    if (f.type === "checkbox")
      return <input {...common} type="checkbox" checked={!!values[f.name]} />;
    return (
      <input
        {...common}
        type={f.type || "text"}
        value={values[f.name]}
        placeholder={f.placeholder}
        step={f.type === "number" ? "any" : undefined}
      />
    );
  };

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="card">
        <h2>Cadastrar {entity.singular}</h2>
        {canCreate ? (
          <form onSubmit={handleSubmit} className="form">
            {entity.fields.map((f) => (
              <div key={f.name} className={`field ${f.type === "checkbox" ? "field-inline" : ""}`}>
                <label htmlFor={f.name}>{f.label}</label>
                {renderField(f)}
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        ) : (
          <p className="muted">Somente usuários com role {entity.createRole} podem cadastrar.</p>
        )}
      </section>

      <section className="card">
        <div className="row-between">
          <h2>{entity.titulo}</h2>
          <button className="btn" onClick={load} disabled={loading}>
            Atualizar
          </button>
        </div>
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="muted">Nada cadastrado ainda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {entity.columns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id ?? i}>
                    {entity.columns.map((c) => (
                      <td key={c.key}>{formatCell(item, c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
