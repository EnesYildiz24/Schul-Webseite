import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router';
import App from '../../src/App';
import { LoginStatus, mockFetch } from './mockFetch';
import userEvent from '@testing-library/user-event'

expect.extend({
    toBeButtonOrLink(received) {
        const pass = ["A", "BUTTON"].includes(received.tagName);
        return {
            pass,
            message: () => `expected ${received} to be a button or A-tag, was ${received.tagName}`
        }
    }
});
interface ButtonMatcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toBeButtonOrLink(): void;
}
declare module '@vitest/expect' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Assertion extends ButtonMatcher {}
}

test('Simple Happy Path', async () => {
    const loginStatus = new LoginStatus(false, true); //  noch nicht eingeloggt, Nutzer kann sich einloggen
    mockFetch(loginStatus); // fetch wird gemockt

    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);

    //////////////////////////////////////
    // Initiale Gebiete sollte geladen sein
    await waitFor(() => {
        const title = screen.getAllByText(/Transfiguration/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });

    //////////////////////////////////////
    // Login-Button im Menü sollte vorhanden sein
    const login = screen.getByText(/Login/i);
    const user = userEvent.setup()
    expect(login).toBeButtonOrLink();
    await act(async () => {
        await user.click(login);
    });

    //////////////////////////////////////
    // Login-Dialog sollte jetzt sichtbar sein
    await waitFor(() => {
        screen.getByLabelText(/Campus ID/i);
        screen.getByLabelText(/Passwort/i);
        expect(screen.getByText("OK")).toBeButtonOrLink();
        expect(screen.getByText("Abbrechen")).toBeButtonOrLink();
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

    //////////////////////////////////////
    // Index-Seite nach Anmeldung, neue Gebiet-Buttons sollten vorhanden sein
    cleanup(); // Löschen des internen React-Status, damit wirklich alles neu gerendert wird und nichts doppelt erscheint.
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    // Initiale Shop-Listen sollte geladen sein
    await waitFor(() => {
        screen.getByText(/Logout/i);
        expect(screen.getByText("Neues Gebiet")).toBeButtonOrLink();
    });

    expect(loginStatus.isLoggedIn).toBeTruthy(); // Nutzer sollte noch immer eingeloggt sein

    //////////////////////////////////////
    // Gebiet (nach erfolgreicher Anmeldung)
    cleanup();
    render(<MemoryRouter initialEntries={["/gebiet/101"]}><App /></MemoryRouter>);
    // Editier-Buttons sollten vorhanden sein
    await waitFor(() => {
        screen.getByText(/Logout/i);
        expect(screen.getByText("Editieren")).toBeButtonOrLink();
        expect(screen.getByText("Löschen")).toBeButtonOrLink();
        expect(screen.getByText("Neues Thema")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Editieren des Gebiets
    await act(async () => {
        await user.click(screen.getByText("Editieren"));
    });
    await waitFor(() => {
        expect(screen.getByText("Speichern")).toBeButtonOrLink();
        expect(screen.getByText("Abbrechen")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Thema (nach erfolgreicher Anmeldung)
    cleanup();
    render(<MemoryRouter initialEntries={["/thema/201"]}><App /></MemoryRouter>);
    // Editier-Buttons sollten vorhanden sein
    await waitFor(() => {
        expect(screen.getByText("Editieren")).toBeButtonOrLink();
        expect(screen.getByText("Löschen")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Editieren des Themas
    await act(async () => {
        await user.click(screen.getByText("Editieren"));
    });
    await waitFor(() => {
        expect(screen.getByText("Speichern")).toBeButtonOrLink();
        expect(screen.getByText("Abbrechen")).toBeButtonOrLink();
    });
});
