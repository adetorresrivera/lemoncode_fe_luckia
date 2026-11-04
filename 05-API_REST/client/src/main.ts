import "./style.css";
import {
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "./hotels.api.ts";

// El recorrido del enunciado (O2), tal cual.
async function testCrud(): Promise<void> {
  console.log("1", (await getHotels()).length);
  const created = await createHotel({ name: "Hotel Tueste", city: "Seattle", lowRate: 90, highRate: 120 });
  console.log("2", created.name, created.id);
  console.log("3", (await getHotel(created.id))?.name);
  console.log("4", (await updateHotel(created.id, { lowRate: 95 })).lowRate);
  await deleteHotel(created.id);
  console.log("5", await getHotel(created.id));
  console.log("6", (await getHotels()).length);
}

const testCrudButton = document.querySelector<HTMLButtonElement>("#test-crud");
if (testCrudButton === null) {
  throw new Error('Falta el botón #test-crud en index.html');
}

testCrudButton.addEventListener("click", () => {
  // El listener no espera a la promesa: sin este catch, un error acabaría
  // como "Uncaught (in promise)".
  testCrud().catch((error: unknown) => {
    console.error("Probar CRUD:", error);
  });
});
