import { GebietResource } from "../Resources";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "./LinkContainer";

export function GebietDescription({ gebiete }: { gebiete: GebietResource[] }) {
  return (
    <div>
      {gebiete.map((gebiet) => (
        <Card key={gebiet.id} className="mb-2">
          <Card.Header as="h3">{gebiet.name}</Card.Header>
          <Card.Body>
            <Card.Text>
              <>
                <strong>Verwalter</strong>
              </>
              : {gebiet.verwalterName}
            </Card.Text>
            <Card.Text>
              <strong>Anzahl der Themen:</strong> {gebiet.anzahlThemen}
            </Card.Text>
            <Card.Text>
              <strong>Erstellt am:</strong> {gebiet.createdAt}
            </Card.Text>
            <Card.Text>
              <strong>beschreibung:</strong> {gebiet.beschreibung}
            </Card.Text>
            <Card.Text>
              <strong>Public:</strong> {gebiet.public ? "ja" : "nein"}
            </Card.Text>
            <Card.Text>
              <strong>Closed:</strong> {gebiet.closed ? "ja" : "nein"}
            </Card.Text>
            <LinkContainer to={`/gebiet/${gebiet.id}`}>
              <Button variant="primary">View Details</Button>
            </LinkContainer>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
