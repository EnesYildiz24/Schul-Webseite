import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  ErrorFromValidation,
  fetchWithErrorHandling,
} from "../backend/fetchWithErrorHandling";
import { getThema } from "../backend/api";
import { ThemaResource } from "../Resources";
import { useLoginContext } from "./LoginContext";

const HOST = import.meta.env.VITE_API_SERVER_URL;

interface ThemaFormProps {
  setEdit: (edit: boolean) => void;
}

export function ThemaForm({ setEdit }: ThemaFormProps) {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const { id, gebietId } = useParams();
  const [validated, setValidated] = useState(false);

  const refTitel = React.useRef<HTMLInputElement>(null);
  const refBeschreibung = React.useRef<HTMLTextAreaElement>(null);
  const refAbschluss = React.useRef<HTMLSelectElement>(null);
  const refStatus = React.useRef<HTMLSelectElement>(null);

  const [thema, setThema] = useState<ThemaResource>({
    titel: "",
    beschreibung: "",
    abschluss: "bsc",
    status: "offen",
    betreuer: loginInfo && typeof loginInfo !== "boolean" ? loginInfo.id : "",
    gebiet: gebietId || "",
    betreuerName:
      loginInfo && typeof loginInfo !== "boolean" ? "Unbekannt" : "",
  });

  function update(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setThema({ ...thema, [e.target.name]: e.target.value });
  }

  React.useEffect(() => {
    async function loadExisting() {
      if (!id) return;
      try {
        const loaded = await getThema(id);
        setThema(loaded);
      } catch (err) {
        console.error("Fehler beim Laden eines bestehenden Themas:", err);
      }
    }
    loadExisting();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refTitel.current?.setCustomValidity("");
    refBeschreibung.current?.setCustomValidity("");
    const form = e.currentTarget as HTMLFormElement;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      if (id) {
        const loaded = await getThema(id);
        const response = await fetchWithErrorHandling(
          `${HOST}/api/thema/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              id,
              titel: refTitel.current?.value,
              beschreibung: refBeschreibung.current?.value,
              gebiet: loaded.gebiet,
              betreuer: loaded.betreuer,
              abschluss: refAbschluss.current?.value,
              status: refStatus.current?.value,
              betreuerName: loaded.betreuerName,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Fehler beim Speichern der Daten.");
        }
      } else {
        const response = await fetchWithErrorHandling(`${HOST}/api/thema`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(thema),
        });
        if (!response.ok) {
          throw new Error("Fehler beim Speichern Post.");
        }
        const result = await response.json();
        navigate(`/thema/${result.id || result._id}`);
      }

      setEdit(false);
    } catch (err) {
      if (err instanceof ErrorFromValidation) {
        err.validationErrors.forEach((validationError) => {
          switch (validationError.path) {
            case "titel":
              refTitel.current?.setCustomValidity(validationError.msg);
              break;
            case "beschreibung":
              refBeschreibung.current?.setCustomValidity(validationError.msg);
              break;
          }
        });
      }
    } finally {
      setValidated(validated);
    }
  }

  function handleCancel() {
    if (id) {
      navigate(`/thema/${id}`);
      setEdit(false);
    } else {
      navigate("/");
    }
  }

  return (
    
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="themaTitel">
        <Form.Label>Titel</Form.Label>
        <Form.Control
          type="text"
          placeholder="Titel eingeben"
          name="titel" 
          ref={refTitel}
          value={thema.titel} 
          onChange={update}
          required
          minLength={3}
          maxLength={100}
        />
        <Form.Control.Feedback type="invalid">
          Bitte Titel mit mindestens 3 Zeichen eingeben.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="themaAbschluss">
        <Form.Label>Abschluss</Form.Label>
        <Form.Select
          name="abschluss" 
          ref={refAbschluss}
          value={thema.abschluss}
          onChange={update} 
        >
          <option value="bsc">B.Sc</option>
          <option value="msc">M.Sc</option>
          <option value="any">Any</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="themaStatus">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          ref={refStatus}
          value={thema.status} 
          onChange={update} 
        >
          <option value="offen">Offen</option>
          <option value="reserviert">Reserviert</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="themaBeschreibung">
        <Form.Label>Beschreibung</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Kurzbeschreibung"
          name="beschreibung" 
          ref={refBeschreibung}
          value={thema.beschreibung} 
          onChange={update}
          required
          minLength={3}
          maxLength={500}
        />
        <Form.Control.Feedback type="invalid">
          Bitte eine Beschreibung mit mindestens 3 Zeichen eingeben.
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit">
          Speichern
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Abbrechen
        </Button>
      </div>
    </Form>
  );
}
