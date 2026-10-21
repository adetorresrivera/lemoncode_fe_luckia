// Botón de modo oscuro. El tema inicial ya lo ha puesto el script del <head>;
// aquí solo se alterna la clase .dark de <html> y se guarda la elección.
const root = document.documentElement;
const button = document.querySelector("#theme-toggle");

function syncButton() {
  button.setAttribute("aria-pressed", String(root.classList.contains("dark")));
}

button.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {
    // Sin localStorage (modo privado, cookies bloqueadas) el tema cambia igual, pero no se recuerda
  }
  syncButton();
});

syncButton();
