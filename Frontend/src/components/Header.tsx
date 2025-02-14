import { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "./LinkContainer";
import { LoginDialog } from "./LoginDialog";
import "./Header.css";
import { useLoginContext } from "./LoginContext";

export function Header() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { loginInfo, setLoginInfo } = useLoginContext();
  const HOST = import.meta.env.VITE_API_SERVER_URL;

  async function postLogout() {
    try {
      await fetch(`${HOST}/api/login`, {
        method: "DELETE",
        credentials: "include",
      });
      setLoginInfo(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  }

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Navbar.Brand>IMBA</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav variant="tabs">
          <LinkContainer to="/">
            <Nav.Link>Übersicht</Nav.Link>
          </LinkContainer>
          {loginInfo && loginInfo.role === "a" && (
            <LinkContainer to="/admin">
              <Nav.Link>Admin</Nav.Link>
            </LinkContainer>
          )}

          {loginInfo && (
            <LinkContainer to="/prefs">
              <Nav.Link>Preferences</Nav.Link>
            </LinkContainer>
          )}

          {loginInfo ? (
            <Nav.Link onClick={postLogout} className="logout-button">
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link
              className="login-button"
              onClick={() => setShowLoginDialog(true)}
            >
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>

      <LoginDialog
        show={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </Navbar>
  );
}
