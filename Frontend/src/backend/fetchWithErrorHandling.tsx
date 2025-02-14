// istanbul ignore file

/**
 * Funktioniert wie fetch, erkennt aber auch Validierungsfehler und HTML-Antworten und
 * wandelt diese in geworfene Errors (ErrorFromValidation und ErrorWithHTML) um.
 * 
 * D.h. statt
 * ```
 * const response = await fetch(url, init);
 * const data: DataType = await response.json();
 * return data;
 * ```
 * schreibt man
 * ```
 * const response = await fetchWithErrorHandling(url, init);
 * const data: DataType = await response.json();
 * return data;
 * ```
 * 
 * Falls die Antwort ein Validierungsfehler ist (Status 400), wird eine Exception vom Typ `ErrorFromValidation` geworfen.
 * Falls die Antwort ein HTML-Dokument ist (Status 404/500), wird eine Exception vom Typ `ErrorWithHTML` geworfen.
 * 
 * Sowohl `ErrorFromValidation` als auch `ErrorWithHTML` sind von Error abgeleitet,
 * haben eine zusätzliche Eigenschaft `status`
 * und können in der Komponente, die im Fehlerfall angezeigt wird, verwendet werden, um den Fehler genauer anzuzeigen.
 * In `ErrorWithHTML` ist die HTML-Antwort in `html` gespeichert,
 * in `ErrorFromValidation` die Fehlermeldungen in `validationErrors`
 * 
 * *Hinweis für Tests*: Ob die Antwort in Ordnung ist oder nicht, wird an dem Property `ok` der Response erkannt.
 */
export async function fetchWithErrorHandling(url: string, init?: RequestInit): Promise<Response> {

    const response: Response = await fetch(url, init);

    const contentType = response.headers.get("Content-Type") ?? "";
    if (!response.ok) {
        if (contentType.startsWith("application/json")) {
            const data = await response.clone().json()
            if (data.errors instanceof Array) {
                const validationErrors = data.errors as ValidationError[];
                throw new ErrorFromValidation(response.status, validationErrors);
            }
        } else if (contentType.startsWith("text/html")) {
            const html = await response.text();
            throw new ErrorWithHTML(response.status, html);
        } else if (contentType.startsWith("text/plain")) {
            const text = await response.text();
            throw new Error(`Status ${response.status}: ${text}`);
        }
    }

    return response;
}

/**
 * ValidationError created by express-validator (without nested errors).
 */
export type ValidationError = {
    /** Fehlerbeschreibung */
    msg: string;
    /** 
     * Pfad zu dem Property innerhalb der Location, in der Regel einfach das Property das 
     * im dem der Fehler auftrat.
     */
    path: string;
    /**
     * Ort innerhalb des Requests, also z.B. "body" oder "params".
     */
    location: string;
    /**
     * Wert des Properties, also in der Regel der Wert, der den Fehler verursacht hat.
     */
    value: string;
}

export class ErrorFromValidation extends Error {
    param: string | undefined;
    status: number;
    validationErrors: ValidationError[];

    private static msg(validationErrors: ValidationError[]): string {
        if (validationErrors.length === 0) {
            return "Unspecified validation error";
        }
        return validationErrors.map((validationError) => {
            return `${validationError.msg} (${validationError.location} ${validationError.path}, value ${validationError.value})`;
        }).join(". ");
    }

    constructor(status: number, validationErrors: ValidationError[]) {
        super(ErrorFromValidation.msg(validationErrors));
        this.status = status;
        this.validationErrors = validationErrors;
    }
}

export class ErrorWithHTML extends Error {
    div: JSX.Element;
    status: number;

    constructor(status: number, html: string) {
        super("Error");
        this.status = status;
        let bodyStart = html.indexOf("<body");
        if (bodyStart >= 0) {
            bodyStart = html.indexOf(">", bodyStart);
        }
        const bodyEnd = html.indexOf("</body>", bodyStart);
        if (bodyStart >= 0 && bodyEnd >= 0) {
            html = html.substring(bodyStart + 1, bodyEnd);
        }
        // An dem Namen sieht man schon: es ist gefährlich und sollte im Allgemeinen nicht verwendet werden.
        // Auf diese Art macht man sich für XSS-Angriffe verwundbar. Wir machen das hier trotzdem,
        // einmal um zu demonstrieren, wie man es nicht macht, und um die Fehler für die Entwicklung schön anzuzeigen.
        // In echten Anwendungen würde man Fehler ohnehin niemals so anzeigen.
        this.div = <div dangerouslySetInnerHTML={{__html: html}} />;
    }
}

