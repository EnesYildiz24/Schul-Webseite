import { Button } from "react-bootstrap";
import { AlleGebiete } from "./AlleGebiete"
import { LinkContainer } from "./LinkContainer";
import { useLoginContext } from "./LoginContext";


export function PageIndex() {
  const { loginInfo } = useLoginContext();

  return (
    <div> 
      <h1>Anzeige aller Gebiete</h1>
      <AlleGebiete />
      {loginInfo && (
        <LinkContainer to="/gebiet/neu">
          <Button variant="success" className="mb-3">
            Neues Gebiet
          </Button>
        </LinkContainer>
      )}
    </div>
  );
}
