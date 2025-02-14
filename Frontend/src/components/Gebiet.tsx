import { useState } from "react";
import { deleteGebiet, getAlleThemen, getGebiet } from "../backend/api";
import React from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router";
import { GebietResource, ThemaResource } from "../Resources";
import { LoadingIndicator } from "./LoadingIndicator";
import { ThemaDescription } from "./ThemaDescription";
import { useLoginContext } from "./LoginContext";
import { GebietForm } from "./GebietForm";

export function Gebiet() {
  const params = useParams();
  const gebietId = params.id;
  const [gebiet, setGebiet] = useState<GebietResource | null>(null);
  const [themen, setThemen] = useState<ThemaResource[] | null>(null);
  const { showBoundary } = useErrorBoundary();
  const { loginInfo } = useLoginContext();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { id } = useParams();
  async function load() {
    try {
      if (gebietId) {
        const gebiet = await getGebiet(gebietId);
        setGebiet(gebiet);
        const geladeneThemen = await getAlleThemen(gebietId);
        setThemen(geladeneThemen);
      }
    } catch (err) {
      setGebiet(null);
      setThemen(null);
      showBoundary(err);
    }
  }

  React.useEffect(() => {
    load();
  }, [edit]);

  if (!gebiet || !themen) {
    return <LoadingIndicator />;
  }

  const isProf =
    loginInfo && typeof loginInfo !== "boolean" && loginInfo.role === "a";
  const isVerwalter =
    loginInfo &&
    typeof loginInfo !== "boolean" &&
    loginInfo?.id === gebiet.verwalter;

  async function handleDelete() {
    await deleteGebiet(id!);
    navigate("/");
  }

  return (
    <div>
      <div className="container mt-4">
        <h1>{gebiet.name}</h1>
        <p>{gebiet.beschreibung}</p>
        {isProf && isVerwalter && (
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => setEdit(true)}>
              Editieren
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setShowDelete(true)}
            >
              Löschen
            </button>
          </div>
        )}

        <ThemaDescription themen={themen} />
        {edit && (
          <div>
            <GebietForm setEdit={setEdit} />
          </div>
        )}
        {showDelete && (
          <>
            <div
              className="modal fade show"
              tabIndex={-1}
              style={{ display: "block" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <p>Möchten Sie dieses Gebiet wirklich löschen?</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowDelete(false)}
                    >
                      Abbrechen
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
}
