import { Route, Routes } from "react-router";
import { PageIndex } from "./components/PageIndex";
import { PageAdmin } from "./components/PageAdmin";
import { PageThema } from "./components/PageThema";
import { PagePrefs } from "./components/PagePrefs";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";
import { Header } from "./components/Header";
import { LoginManager } from "./components/LoginManager";
import { PageGebiet } from "./components/PageGebiet";
import { GebietForm } from "./components/GebietForm";
import { useState } from "react";
import { ThemaForm } from "./components/ThemaForm";

function App() {
  const [, setEdit] = useState(false);
  return (
    <LoginManager>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<PageIndex />} />
            <Route path="*" element={<PageIndex />} />
            <Route path="/gebiet/:id" element={<PageGebiet />} />
            <Route
              path="/gebiet/neu"
              element={<GebietForm setEdit={setEdit} />}
            />
            <Route
              path="/gebiet/:gebietId/thema/neu"
              element={<ThemaForm setEdit={setEdit} />}
            />

            <Route path="/thema/:id" element={<PageThema />} />
            <Route path="/admin" element={<PageAdmin />} />
            <Route path="/prefs" element={<PagePrefs />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </LoginManager>
  );
}

export default App;
