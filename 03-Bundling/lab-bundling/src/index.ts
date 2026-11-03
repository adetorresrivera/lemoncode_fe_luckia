import "./styles/main.scss";
import coffeePhoto from "./assets/coffee.jpg";

console.log("Bienvenido a Tueste ☕");

console.log(coffeePhoto);

const img = document.createElement("img");
img.src = coffeePhoto;
img.alt = "";
document.body.appendChild(img);

// Error de tipos a propósito (obligatorio 4): Vite no lo detecta por sí solo.
const total: string = 3;
console.log(total);
