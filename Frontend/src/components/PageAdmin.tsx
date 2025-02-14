import { Container, Row, Col, Card } from "react-bootstrap";

export function PageAdmin() {
  return (
    <Container className="mt-5 pt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Use Case: Profs verwalten</Card.Title>
              <Card.Text>
                Die Umsetzung erfolgt derzeit nur als Platzhalter.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
