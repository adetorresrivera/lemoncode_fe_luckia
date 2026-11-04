import { Link, Outlet } from "@tanstack/react-router";

export function AppLayout() {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-2xl font-bold">Tueste</p>
          <nav aria-label="Principal">
            <ul className="flex gap-4">
              <li>
                <Link to="/coffees" activeOptions={{ exact: true }}>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/coffees/new">Añadir café</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
