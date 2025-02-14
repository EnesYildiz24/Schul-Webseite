import { Container, Row, Col, Card } from "react-bootstrap";

export function PagePrefs() {
  return (
    <Container className="mt-5 pt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Professoren Einstellungen</Card.Title>
              <Card.Text>
                Diese Seite dient derzeit nur als Platzhalter.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
