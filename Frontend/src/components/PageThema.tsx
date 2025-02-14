import { useState, useEffect } from "react";
import React from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useParams, useNavigate } from "react-router";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { LinkContainer } from "./LinkContainer";
import { useLoginContext } from "./LoginContext";
import { ThemaResource } from "../Resources";
import { LoadingIndicator } from "./LoadingIndicator";
import { getThema, deleteThema } from "../backend/api"; 
import { ThemaForm } from "./ThemaForm";

export function PageThema() {
  const params = useParams();
  const themaId = params.id;
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const { loginInfo } = useLoginContext();

  const [thema, setThema] = useState<ThemaResource | null>(null);
  const [edit, setEdit] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    load();
  }, [edit]);

  async function load() {
    try {
      if (themaId) {
        const geladeneThemen = await getThema(themaId);
        setThema(geladeneThemen);
      }
    } catch (err) {
      setThema(null);
      showBoundary(err);
    }
  }

  const isProf =
    loginInfo && typeof loginInfo !== "boolean" && loginInfo.role === "a";
  const isBetreuer =
    loginInfo &&
    typeof loginInfo !== "boolean" &&
    thema &&
    thema.betreuer === loginInfo.id;

  async function handleDelete() {
    try {
      if (!themaId || !thema) return;
      await deleteThema(themaId);
      navigate(`/gebiet/${thema.gebiet}`);
    } catch (err) {
      showBoundary(err);
    }
  }

  if (!thema) {
    return <LoadingIndicator />;
  }

  if (edit) {
    return (
      <div className="container mt-4">
        <h2>Thema bearbeiten</h2>
        <ThemaForm setEdit={setEdit} />
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h5">{thema.titel}</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Betreuer (Name):</strong> {thema.betreuerName}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> {thema.status}
              </Card.Text>
              <Card.Text>
                <strong>Abschluss:</strong> {thema.abschluss}
              </Card.Text>
              <Card.Text>
                <strong>Beschreibung:</strong> {thema.beschreibung}
              </Card.Text>
              <Card.Text>
                <strong>updatedAt:</strong> {thema.updatedAt}
              </Card.Text>

              <LinkContainer to={`/gebiet/${thema.gebiet}`}>
                <Button variant="primary" className="me-2">
                  Zurück zum Gebiet
                </Button>
              </LinkContainer>

              {isProf && isBetreuer && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setEdit(true)}
                    className="me-2"
                  >
                    Editieren
                  </Button>
                  <Button variant="danger" onClick={() => setShowDelete(true)}>
                    Löschen
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showDelete && (
        <>
          <div
            className="modal fade show"
            tabIndex={-1}
            style={{ display: "block" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <p>Möchten Sie dieses Thema wirklich löschen?</p>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDelete(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </Container>
  );
}
