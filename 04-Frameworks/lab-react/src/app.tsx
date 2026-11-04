interface Member {
  id: string;
  name: string;
}

export function App() {
  const members: Member[] = [
    { id: "1", name: "Julia" },
    { id: "2", name: "Evan" },
  ];

  return (
    <main>
      <h1>Equipo · React</h1>
      <p>Datos ficticios para la clase.</p>
      <label htmlFor="name">Nombre</label> <input id="name" />
      <button>Añadir</button>
      <p aria-live="polite">Personas: {members.length}</p>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="rounded bg-white p-3">
            {member.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
