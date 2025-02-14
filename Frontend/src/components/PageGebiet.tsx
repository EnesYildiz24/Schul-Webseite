import React from "react";
import { Gebiet } from "./Gebiet"; 
import { LinkContainer } from "./LinkContainer";
import { Button } from "react-bootstrap";
import { useLoginContext } from "./LoginContext";
import { useParams } from "react-router-dom";
import { getAlleThemen } from "../backend/api";

export function PageGebiet() {
  const { loginInfo } = useLoginContext();
  const params = useParams();
  const themaId = params.id;
  console.log("Geladene ID im Frontende:", themaId); 

  React.useEffect(() => {
    getAlleThemen(themaId!); 
  }, []);

  return (
    
    <div>
      <h1>Themen im Gebiet anzeigen</h1>
      <Gebiet />
      {loginInfo && (
        <LinkContainer to={`/gebiet/${params.id}/thema/neu`}>
          <Button variant="success" className="mb-3">
            Neues Thema
          </Button>
        </LinkContainer>
      )}
    </div>
  );
}
