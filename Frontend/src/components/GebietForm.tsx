import React, { useEffect, useState } from "react";
import { GebietResource } from "../Resources";
import { useLoginContext } from "./LoginContext";
import { fetchWithErrorHandling } from "../backend/fetchWithErrorHandling";
import { useNavigate, useParams } from "react-router-dom";

type ValidationMessages<Type> = {
  [Property in keyof Type]?: string;
};
const HOST = import.meta.env.VITE_API_SERVER_URL;

interface GebietFormProps {
  setEdit: (edit: boolean) => void
}

export function GebietForm({setEdit}: GebietFormProps) {
  const { loginInfo } = useLoginContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [gebiet, setGebiet] = useState<GebietResource>({
    name: "",
    beschreibung: "",
    public: false,
    closed: false,
    verwalter: loginInfo && typeof loginInfo !== "boolean" ? loginInfo.id : "",
  });

  useEffect(() => {
    if (loginInfo && typeof loginInfo !== "boolean") {
      setGebiet((validationErrors) => ({
        ...validationErrors,
        verwalter: loginInfo.id,
      }));
    }
  }, [loginInfo]);
  const [validationErrors, setValidationErrors] = useState<
    ValidationMessages<GebietResource>
  >({});

  function validate(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setValidationErrors({
          ...validationErrors,
          name:
            value.length < 3
              ? "Der Name muss mindestens 3 Zeichen lang sein."
              : undefined,
        });
        break;
      case "beschreibung":
        setValidationErrors({
          ...validationErrors,
          beschreibung:
            value.length > 100
              ? "Die Beschreibung darf maximal 100 Zeichen lang sein."
              : undefined,
        });
        break;
    }
  }

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setGebiet({ ...gebiet, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (id) {

        const response = await fetchWithErrorHandling(
          `${HOST}/api/gebiet/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...gebiet,
              id,
              verwalterName: "default name", //darf nicht im body enthalten sein
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Fehler beim Speichern der Daten.");
        }
        const updated = await response.json();
        navigate(`/gebiet/${updated.id}`);
        setEdit(false)
      } else {
        const response = await fetchWithErrorHandling(`${HOST}/api/gebiet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(gebiet),
        });
        if (!response.ok) {
          throw new Error("Fehler beim Speichern der Daten.");
        }
        const result = await response.json();
        navigate(`/gebiet/${result.id}`);
      }
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }
  }

  function handleCancel() {
    if (id) {
      navigate(`/gebiet/${id}`);
      setEdit(false)
    } else {
      navigate("/");
    }
  }

  return (
    <div className="container">
      {Object.values(validationErrors).map(
        (msg, idx) =>
          msg && (
            <div key={idx} className="alert alert-danger" role="alert">
              {msg}
            </div>
          )
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="gebietName" className="form-label">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="gebietName"
            className="form-control"
            value={gebiet.name}
            onChange={update}
            onBlur={validate}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gebietBeschreibung" className="form-label">
            Beschreibung:
          </label>
          <textarea
            name="beschreibung"
            id="gebietBeschreibung"
            className="form-control"
            rows={3}
            value={gebiet.beschreibung}
            onChange={update}
            onBlur={validate}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="public"
            id="gebietPublic"
            className="form-check-input"
            checked={gebiet.public}
            onChange={(e) =>
              setGebiet((prev) => ({ ...prev, public: e.target.checked }))
            }
          />
          <label className="form-check-label" htmlFor="gebietPublic">
            Öffentlich
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="closed"
            id="gebietClosed"
            className="form-check-input"
            checked={gebiet.closed}
            onChange={(e) =>
              setGebiet((prev) => ({ ...prev, closed: e.target.checked }))
            }
          />
          <label className="form-check-label" htmlFor="gebietClosed">
            Geschlossen
          </label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Speichern
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
