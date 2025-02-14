import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useLoginContext } from "./LoginContext";
import { postLogin } from "../backend/api";

interface LoginDialogProps {
  show: boolean;
  onClose: () => void;
}
export function LoginDialog({ show, onClose }: LoginDialogProps) {
  const [loginData, setLoginData] = useState({ campusID: "", password: "" });
  const { setLoginInfo } = useLoginContext();
  const [error, setError] = useState<string | null>(null);

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const loginRes = await postLogin(loginData.campusID, loginData.password);
      setLoginInfo(loginRes);
      setLoginData({ campusID: "", password: "" });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("Eingabedaten fehlerhaft")) {
        setError("Die Eingaben sind fehlerhaft. Überprüfe deine Daten.");
      } else if (message.includes("Ungültige Daten")) {
        setError("Die Login-Daten sind ungültig. Bitte versuche es erneut.");
      } else {
        setError("Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es später erneut.");
      }
      setLoginInfo(false);
    }
  };

  function onCancel() {
    setLoginData({ campusID: "", password: "" });
    setError(null);
    onClose();
  }
  return (
    <Modal show={show} onHide={onCancel} backdrop="static" centered>
      <Form onSubmit={onLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group controlId="campusIdField">
            <Form.Label>Campus ID</Form.Label>
            <Form.Control
              type="text"
              name="campusID"
              value={loginData.campusID}
              onChange={update}
            />
          </Form.Group>
          <Form.Group controlId="passwordField" className="mt-3">
            <Form.Label>Passwort</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={loginData.password}
              onChange={update}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button variant="primary" type="submit">
            OK
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
