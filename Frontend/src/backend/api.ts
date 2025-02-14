import { ThemaResource, GebietResource, LoginResource } from "../Resources";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";

export const MAX_LENGTH_LINE_STRING = 100;
export const MAX_LENGTH_MULTILINE_STRING = 1000;
const HOST = import.meta.env.VITE_API_SERVER_URL;

export async function getAlleGebiete(): Promise<GebietResource[]> {
  const url = `${HOST}/api/gebiet/alle`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function getAlleThemen(
  gebietId: string
): Promise<ThemaResource[]> {
  const url = `${HOST}/api/gebiet/${gebietId}/themen`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include",
  });
  return await response.json();
}

export async function getGebiet(gebietId: string): Promise<GebietResource> {
  const url = `${HOST}/api/gebiet/${gebietId}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include",
  });
  return await response.json();
}

export async function createGebiet(
  gebietResource: GebietResource
): Promise<GebietResource> {
  const url = `${HOST}/api/gebiet/`;
  const response = await fetchWithErrorHandling(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gebietResource),
  });
  return await response.json();
}

export async function updateGebiet(
  gebietId: string,
  gebietResource: GebietResource
): Promise<GebietResource> {
  const url = `${HOST}/api/gebiet/${gebietId}`;
  const response = await fetchWithErrorHandling(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(gebietResource),
  });
  return await response.json();
}

export async function deleteGebiet(gebietId: string): Promise<void> {
  const url = `${HOST}/api/gebiet/${gebietId}`;
  await fetchWithErrorHandling(url, {
    method: "DELETE",
    credentials: "include",
  });
}
export async function deleteThema(themaId: string): Promise<void> {
  const url = `${HOST}/api/thema/${themaId}`;
  await fetchWithErrorHandling(url, {
    method: "DELETE",
    credentials: "include",
  });
}
export async function getThema(themaId: string): Promise<ThemaResource> {
  const url = `${HOST}/api/thema/${themaId}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include",
  });
  return await response.json();
}
export async function getLogin(): Promise<LoginResource> {
  const url = `${HOST}/api/login/`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include",
  });
  return await response.json();
}

export async function postLogin(campusID: string, password: string) {
  const response = await fetch(`${HOST}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campusID, password }),
    credentials: "include" as RequestCredentials,
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Eingabedaten fehlerhaft");
    } else if (response.status === 401) {
      throw new Error("Ungültige Daten");
    }
    throw new Error("Serverfehler");
  }
  return await response.json();
}
