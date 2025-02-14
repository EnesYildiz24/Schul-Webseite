import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { MemoryRouter } from "react-router";
import App from "../../src/App";
import { LoginDialog } from "../../src/components/LoginDialog";
import { LoginContext } from "../../src/components/LoginContext";
import { LoginResource } from "../../src/Resources";
import { LoginStatus, mockFetch, responseWithJSON } from "./mockFetch";

/*
 * Die folgenden beiden Tests prüfen, dass
 * - der Login-Dialog das Backend aufruft
 * - der Login-Dialog über die App aufgerufen werden kann
 *
 * In beiden Fällen kann es sein, dass Ihre Implementierung etwas anders funktioniert und Sie daher
 * die Tests anpassen müssen. So kann es sein, dass Ihr LoginDialog anders heißt oder der Login-Context
 * anders bereit gestellt wird.
 *
 * Daher sind beide Tests auch etwas unterschiedlich aufgebaut, in der Hoffnung, dass einer der beiden
 * Tests bei Ihnen direkt und ohne Umbauen funktioniert.
 */

test("LoginDialog ruft (indirekt) Backend auf", async () => {
  let login: LoginResource | undefined | false = undefined;
  const setLogin = (newLogin: LoginResource | undefined | false) => {
    login = newLogin;
  };

  const expectedLogin: LoginResource = { id: "123", role: "u", exp: 1234567890 };

  render(
    <LoginContext.Provider value={{ loginInfo: login, setLoginInfo: setLogin }}>
      <MemoryRouter initialEntries={["/"]}>
        <LoginDialog show={true} onClose={() => {}} />
      </MemoryRouter>
    </LoginContext.Provider>
  );

  const campusID = screen.getByLabelText(/Campus ID/i);
  const passwort = screen.getByLabelText(/Passwort/i);

  fireEvent.change(campusID, { target: { value: "Name" } });
  fireEvent.change(passwort, { target: { value: "123" } });

  let calledURL: string | undefined = undefined;
  let sentInit: RequestInit | undefined = undefined;

  const jestMock = vi.spyOn(global, "fetch").mockImplementation(async (request, init) => {
      calledURL = String(request);
      sentInit = init;
      const resp = responseWithJSON(200, request.toString(), expectedLogin);
      return Promise.resolve(resp);
    });

  await act(async () => {
    const okButton = screen.getByText(/OK/i);
    fireEvent.click(okButton);
  });
  await waitFor(() => {
    expect(jestMock).toHaveBeenCalledTimes(1);
  });

  // Request prüfen (außerhalb der Lambda, um Testergebnisse zu sehen)
  expect(String(calledURL)).toMatch(/\/api\/login/i);
  expect(sentInit).toBeDefined();
  expect(sentInit!.method).toEqual("POST");

  expect(login).toEqual(expectedLogin);
});

test("Login-Dialog über App aufrufbar", async () => {
  const loginStatus = new LoginStatus(false, true); //  noch nicht eingeloggt, Nutzer kann sich einloggen
  mockFetch(loginStatus); // fetch wird gemockt

  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  //////////////////////////////////////
  // Initiale Gebiete sollte geladen sein
  await waitFor(() => {
    const title = screen.getAllByText(/Transfiguration/i);
    expect(title.length).toBeGreaterThanOrEqual(1);
  });

  //////////////////////////////////////
  // Login-Dialog noch nicht sichtbar
  expect(screen.queryByLabelText(/Campus ID/i)).toBeNull();
  expect(screen.queryByLabelText(/Passwort/i)).toBeNull();

  //////////////////////////////////////
  // Login im Menü sollte vorhanden sein
  const login = screen.getByText(/Login/i);
  const user = userEvent.setup();

  //////////////////////////////////////
  // Click auf Login
  await act(async () => {
    await user.click(login);
  });

  //////////////////////////////////////
  // Login-Dialog sollte jetzt sichtbar sein
  await waitFor(() => {
    screen.getByLabelText(/Campus ID/i);
    screen.getByLabelText(/Passwort/i);
  });

  //////////////////////////////////////
  // Login-Dialog ausfüllen und OK klicken
  const email = screen.getByLabelText(/Campus ID/i);
  const password = screen.getByLabelText(/Passwort/i);
  const ok = screen.getByText("OK");
  act(() => {
    fireEvent.change(email, { target: { value: "john@some-host.de" } });
    fireEvent.change(password, { target: { value: "12abcAB!" } });
    fireEvent.click(ok);
  });

  expect(loginStatus.isLoggedIn).toBeTruthy(); // Nutzer sollte jetzt eingeloggt sein
});
