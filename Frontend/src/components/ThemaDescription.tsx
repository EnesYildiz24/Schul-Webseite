import { Link } from "react-router-dom";
import { ThemaResource } from "../Resources";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export function ThemaDescription({ themen }: { themen: ThemaResource[] }) {

    return (
      <div>
        <h2>Themen:</h2>
        {themen.map((thema) => (
          <Card key={thema.id} className="mb-3">
            <Card.Body>
              <Card.Title>{thema.titel}</Card.Title>
              <Link to={`/thema/${thema.id}`}>
                <Button variant="primary">Details ansehen</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }

