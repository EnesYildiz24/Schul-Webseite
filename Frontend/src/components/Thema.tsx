interface ThemaResource {
  titel: string;
  beschreibung: string;
  abschluss?: string;
  status?: string;
  betreuer: string;
  betreuerName?: string;
  gebiet: string;
  updatedAt?: string;
}

export function Thema({ thema }: { thema: ThemaResource }) {
  return (
    <div>
      <h2>{thema.titel}</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Beschreibung:</strong></td>
            <td>{thema.beschreibung}</td> 
          </tr>
          <tr>
            <td><strong>Abschluss:</strong></td>
            <td>{thema.abschluss}</td>
          </tr>
          <tr>
            <td><strong>Status:</strong></td>
            <td>{thema.status}</td>
          </tr>
          <tr>
            <td><strong>Betreuer:</strong></td>
            <td>{thema.betreuer}</td>
          </tr>
          <tr>
            <td><strong>BetreuerName:</strong></td>
            <td>{thema.betreuerName}</td>
          </tr>
          <tr>
            <td><strong>Gebiet:</strong></td>
            <td>{thema.gebiet}</td>
          </tr>
          <tr>
            <td><strong>Zuletzt aktualisiert:</strong></td>
            <td>{thema.updatedAt}</td>
          </tr>
          </tbody>
      </table>
    </div>
  );
}
