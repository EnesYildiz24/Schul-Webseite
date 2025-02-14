import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  // Lade .env-file (mit allen Prefixen, v.a. ohne VITE-Prefix)
  const env = loadEnv(mode, process.cwd(), '');
  if (!env.FRONTEND_SERVER_URL) {
    throw new Error(`FRONTEND_SERVER_URL must be defined in .env file:  ${JSON.stringify(env, null, 2)}`)
  }
  // Parse FRONTEND_SERVER_URL, wir erwarten i.A. https://localhost:3000
  const res = /^(https?):\/\/[0-9a-z_.]+(?::([0-9]+))?$/g.exec(env.FRONTEND_SERVER_URL);
  if (!res) {
    throw new Error("FRONTEND_SERVER_URL must defined in .env file")
  }
  // Die SSL-Informationen sind (bei Bedarf) ebenfalls in der .env-Datei definiert
  const https = res[1] === "https" ? {
    key: env.SSL_KEY_FILE,
    cert: env.SSL_CRT_FILE
  } : undefined;
  // Setze Port, falls nicht definiert, verwende 3000
  const port = res[2] ? Number(res[2]) : 3000;

  // Und gebe Konfiguration zurück
  return {
    plugins: [react()],
    server: {
      port: port,
      https: https
    },
    build: {
      sourcemap: true
    }
  }
});
