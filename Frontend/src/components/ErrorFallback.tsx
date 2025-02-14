import { useEffect } from "react";
import { useLoginContext } from "./LoginContext";
import { Link } from "react-router-dom";

const HOST = import.meta.env.VITE_API_SERVER_URL;

export function ErrorFallback({ error }: { error: Error }) {
  const { loginInfo, setLoginInfo } = useLoginContext();

  useEffect(() => {
    if (loginInfo) {
      (async () => {
        try {
          await fetch(`${HOST}/api/login`, {
            method: "DELETE",
            credentials: "include",
          });
          setLoginInfo(false);
        } catch (err) {
          console.error("Fehler beim automatischen Logout:", err);
        }
      })();
    }
  }, [loginInfo, setLoginInfo]);

  return (
    <div>
      <h1>Something went wrong:</h1>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>

      <p>
        <Link to="/">Zur Übersichtsseite</Link>
      </p>
    </div>
  );
}
