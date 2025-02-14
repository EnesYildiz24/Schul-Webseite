import { useState, useEffect } from "react";
import { GebietResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import { getAlleGebiete } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { GebietDescription } from "./GebietDescription";
import { Alert } from "react-bootstrap";
import { useLoginContext } from "./LoginContext";

export function AlleGebiete() {
  const [gebiete, setGebiete] = useState<GebietResource[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const { showBoundary } = useErrorBoundary();
  const { loginInfo } = useLoginContext(); 

  async function loadGebiete() {
    try {
      setLoading(true);
      const allGebiete = await getAlleGebiete();
      const filteredGebiete = loginInfo
      ? allGebiete.filter(
          (gebiet) =>
            gebiet.public || (gebiet.verwalter && gebiet.verwalter === loginInfo.id)
        )
      : allGebiete.filter((gebiet) => gebiet.public);
    
      setGebiete(filteredGebiete);
      setError(null);
    } catch (err) {
      setGebiete(null);
      setError("Fehler beim Laden der Gebiete.");
      showBoundary(err);
    } finally {
      setLoading(false);
    }
  }
 
  useEffect(() => {
    loadGebiete();
  }, [loginInfo]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={() => setError(null)}>
        <Alert.Heading>Fehler</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div>
      {gebiete && gebiete.length > 0 ? (
        <GebietDescription gebiete={gebiete} />
      ) : (
        <p>Keine Gebiete verfügbar.</p>
      )}
    </div>
  );
}
