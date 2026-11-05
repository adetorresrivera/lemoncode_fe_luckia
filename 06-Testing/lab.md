🧪 Laboratorio · Módulo 06 · Testing
⏱️ Dedicación estimada: 3-5 h para los obligatorios; los opcionales y desafíos, lo que queráis estirar. 📦 Formato: enlace a un repositorio de GitHub

La idea
En el módulo hemos visto cómo probar código automáticamente con Vitest y Testing Library: funciones puras, spies y mocks, código asíncrono, componentes de React, hooks, temporizadores y Context.

En este laboratorio el código ya está escrito: es un trozo del catálogo de Tueste que conocéis de los laboratorios 2 y 4 ☕ (un carrito, una llamada a la API, una tarjeta de café, un hook y el catálogo completo). Vuestro trabajo es escribir los tests.

Cada obligatorio sigue el esquema de los laboratorios anteriores, con un cambio en la segunda parte:

🛠️ Qué probar: los casos que tienen que cubrir vuestros tests.
💥 Romped el código: un cambio que tenéis que hacer a propósito en el código para comprobar que algún test se pone en rojo. Un test que no falla cuando el código está mal no sirve de nada. Después, deshacéis el cambio.
📝 Qué responder: una o dos preguntas para el README.
La regla del juego (la de siempre):

✅ La IA está permitida y recomendada. Y aquí es especialmente útil: escribir tests es repetitivo.
⚠️ Pero tenéis que entender cada test que entregáis. Si en la revisión os preguntamos "¿por qué aquí findBy y no getBy?" o "¿qué estáis comprobando realmente con este expect?", tenéis que saber responder. Y cuidado: un test escrito por la IA que pasa a la primera no demuestra nada hasta que lo veis fallar (de ahí el 💥).
Punto de partida
Copiad a vuestro repositorio la carpeta 06-testing/.start-code e instalad:

npm install
Antes de empezar, dos arreglos en el proyecto de partida, para que la comprobación de tipos (npm run type-check) salga limpia:

En tsconfig.json, cambiad "module": "nodenext" por "module": "esnext" y "moduleResolution": "nodenext" por "moduleResolution": "bundler". Con nodenext, TypeScript exige escribir .js al final de cada import relativo y, además, no reconoce bien los tipos de user-event. Con bundler funciona como en los laboratorios 3 y 4.
En src/index.tsx, añadid ! a document.getElementById('root')!. Desde TypeScript 6, el modo estricto viene activado por defecto (laboratorio 2).
Comprobadlo: npm run type-check no muestra nada.

El código que vais a probar
Cread la carpeta src/catalog con estos ficheros. No los cambiéis (salvo en los pasos 💥, y luego deshacéis el cambio).

./src/catalog/model.ts

export interface Coffee {
  id: number;
  name: string;
  origin: string;
  price: number;
  discount?: number;
}

export interface CartItem {
  coffeeId: number;
  quantity: number;
}
./src/catalog/cart.ts

import type { CartItem, Coffee } from './model';

export const formatPrice = (price: number): string => `${price.toFixed(2)} €`;

export const finalPrice = (coffee: Coffee): number =>
  coffee.price * (1 - (coffee.discount ?? 0));

export const addToCart = (cart: CartItem[], coffeeId: number): CartItem[] =>
  cart.some((item) => item.coffeeId === coffeeId)
    ? cart.map((item) =>
        item.coffeeId === coffeeId ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...cart, { coffeeId, quantity: 1 }];

export const removeFromCart = (cart: CartItem[], coffeeId: number): CartItem[] =>
  cart.filter((item) => item.coffeeId !== coffeeId);

export const cartTotal = (cart: CartItem[], coffees: Coffee[]): number =>
  cart.reduce((total, item) => {
    const coffee = coffees.find((c) => c.id === item.coffeeId);
    return coffee ? total + finalPrice(coffee) * item.quantity : total;
  }, 0);
./src/catalog/coffee.api.ts

import type { Coffee } from './model';

export const url = '/api/coffees';

export const getCoffees = async (): Promise<Coffee[]> => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error('Catálogo no encontrado');
      case 503:
        throw new Error('Servicio no disponible');
      default:
        throw new Error('Error inesperado');
    }
  }

  const { data } = await response.json();
  return data;
};
./src/catalog/coffee-card.tsx

import React from 'react';
import type { Coffee } from './model';
import { finalPrice, formatPrice } from './cart';

interface Props {
  coffee: Coffee;
  onAdd: (coffee: Coffee) => void;
}

export const CoffeeCard: React.FC<Props> = ({ coffee, onAdd }) => (
  <li>
    <h3>{coffee.name}</h3>
    <p>{coffee.origin}</p>
    <p>{formatPrice(finalPrice(coffee))}</p>
    {coffee.discount ? <p>-{coffee.discount * 100} %</p> : null}
    <button onClick={() => onAdd(coffee)}>Añadir {coffee.name} al carrito</button>
  </li>
);
./src/catalog/use-cart.ts

import React from 'react';
import type { CartItem, Coffee } from './model';
import { addToCart, cartTotal, removeFromCart } from './cart';

export const useCart = (coffees: Coffee[]) => {
  const [cart, setCart] = React.useState<CartItem[]>([]);

  const add = (coffee: Coffee) => setCart((previous) => addToCart(previous, coffee.id));
  const remove = (coffeeId: number) => setCart((previous) => removeFromCart(previous, coffeeId));
  const clear = () => setCart([]);

  const units = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal(cart, coffees);

  return { cart, units, total, add, remove, clear };
};
./src/catalog/coffee-catalog.tsx

import React from 'react';
import type { Coffee } from './model';
import { getCoffees } from './coffee.api';
import { formatPrice } from './cart';
import { CoffeeCard } from './coffee-card';
import { useCart } from './use-cart';

export const CoffeeCatalog: React.FC = () => {
  const [coffees, setCoffees] = React.useState<Coffee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const { units, total, add, clear } = useCart(coffees);

  React.useEffect(() => {
    getCoffees()
      .then(setCoffees)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando…</p>;
  if (error) return <p role="alert">{error}</p>;

  const visible = coffees.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section>
      <h2>Cafés del mes</h2>
      <label htmlFor="filter">Buscar</label>
      <input id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
      {visible.length === 0 ? (
        <p>Sin resultados</p>
      ) : (
        <ul>
          {visible.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} onAdd={add} />
          ))}
        </ul>
      )}
      <p>
        {units} bolsas · {formatPrice(total)}
      </p>
      <button onClick={clear} disabled={units === 0}>Vaciar carrito</button>
    </section>
  );
};
Y los datos de prueba que usaréis en todos los tests:

./src/catalog/test-data.ts

import type { Coffee } from './model';

export const coffees: Coffee[] = [
  { id: 1, name: 'Etiopía Yirgacheffe', origin: 'Etiopía', price: 14.9, discount: 0.1 },
  { id: 2, name: 'Colombia Huila', origin: 'Colombia', price: 12.9 },
  { id: 3, name: 'Brasil Cerrado', origin: 'Brasil', price: 10.5 },
];
Reglas para todos los tests
✅ Cada test con su estructura Arrange / Act / Assert (aunque sea en comentarios), como en el módulo.
✅ Nombres de test que digan qué se espera y en qué caso: "debería devolver 0 cuando el carrito está vacío", no "test 1".
✅ Un test no depende de otro: cada uno prepara lo que necesita.
✅ npx vitest run en verde y npm run type-check sin errores.
✅ Parte 1 · Obligatorios
Todos son necesarios para aprobar.

O1 · Configurar Vitest (demos 01 y 05)
🛠️ Qué hacer

Dejad el proyecto como al final de la demo 05:

vitest, jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom y @testing-library/user-event como dependencias de desarrollo.
Un config/test/config.ts con globals, restoreMocks, environment: 'jsdom' y un setupFiles que cargue @testing-library/jest-dom/vitest.
El config/test/config.d.ts y el setup.ts añadidos al include del tsconfig.json.
Un script "test": "vitest -c ./config/test/config.ts".
Probadlo con un src/dummy.spec.ts con un test que pase y otro que falle (demo 01). Cuando funcione, borradlo.

🔎 Qué comprobar

npm test arranca en modo vigilancia: guardad un fichero y los tests se vuelven a ejecutar solos.
npx vitest run -c ./config/test/config.ts los ejecuta una vez y termina. (Si queréis, añadid un script "test:run" con eso).
📝 Qué responder

¿Para qué sirve environment: 'jsdom'? ¿Qué pasaba en la demo 05 sin él?
¿Qué hace restoreMocks: true y qué problema evita entre un test y el siguiente?
O2 · Funciones puras: el carrito (demo 02)
Fichero src/catalog/cart.spec.ts.

🛠️ Qué probar

Función	Casos (como mínimo)
formatPrice	14.9 → "14.90 €"; 10 → "10.00 €"
finalPrice	Con descuento (Etiopía → 13.41); sin descuento (Colombia → 12.9); con discount: 0
addToCart	Carrito vacío → lo añade con cantidad 1; café que ya está → suma 1; no modifica el carrito que recibe
removeFromCart	Quita el café indicado y deja los demás
cartTotal	Carrito vacío → 0; 2 × Etiopía + 1 × Brasil → 37.32; un coffeeId que no existe cuenta como 0
💡 toBe, toEqual o toBeCloseTo. Para objetos y arrays, toEqual (compara el contenido; toBe compara la referencia, demo 02). Para números con decimales, toBeCloseTo: 14.9 * 0.9 no da exactamente 13.41 en JavaScript (podéis comprobarlo en la consola del navegador).

💡 Para comprobar que no muta: guardad el carrito original, llamad a addToCart y comprobad que el original sigue igual (toEqual) y que el resultado es otro array (not.toBe).

💥 Romped el código

En addToCart, cambiad { ...item, quantity: item.quantity + 1 } por ((item.quantity += 1), item): el carrito se sigue calculando bien, pero ahora muta. Algún test tiene que ponerse rojo.
En finalPrice, quitad el descuento (coffee.price a secas). Algún test tiene que ponerse rojo.
Si con alguno de los dos cambios todo sigue en verde, os falta un test.

📝 Qué responder

¿Por qué las funciones puras (laboratorio 2) son las más fáciles de probar? ¿Qué habéis tenido que preparar en el Arrange?
O3 · Código asíncrono: la llamada a la API (demo 04)
Fichero src/catalog/coffee.api.spec.ts. Aquí no hay servidor: sustituís fetch por un spy que devuelve la respuesta que vosotros decidís.

vi.spyOn(globalThis, 'fetch').mockResolvedValue(
  new Response(JSON.stringify({ data: coffees }), { status: 200 })
);
(La demo usaba axios; con fetch es lo mismo, pero el objeto que se espía es globalThis, y la respuesta se construye con new Response(cuerpo, { status })).

🛠️ Qué probar

Con un 200, devuelve los cafés y llama a fetch con '/api/coffees' y la cabecera Accept: application/json.
Con un 404, rechaza con "Catálogo no encontrado".
Con un 503, rechaza con "Servicio no disponible".
Con cualquier otro error (por ejemplo, 500), rechaza con "Error inesperado".
Si fetch falla por red (mockRejectedValue(new TypeError('Failed to fetch'))), el error llega tal cual.
Para los rechazos, usad await expect(getCoffees()).rejects.toThrow('…').

💡 Los casos 2, 3 y 4 son iguales salvo el estado y el mensaje. Probad it.each para escribirlos una sola vez.

💥 Romped el código

En coffee.api.ts, cambiad case 503: por case 502:. Algún test tiene que ponerse rojo.
🪤 Y romped un test. La demo 04 también comprobaba los errores con try/catch. Escribid el caso del 503 de esa forma:

try {
  await getCoffees();
} catch (error) {
  expect((error as Error).message).toBe('Servicio no disponible');
}
Ahora cambiad el mock para que devuelva un 200: el test sigue en verde, aunque getCoffees ya no falla. Añadid expect.assertions(1) al principio del test y repetid. Explicad qué ha pasado y quedaos con la versión de rejects.

📝 Qué responder

¿Por qué no queremos que los tests llamen a la API de verdad? Dad al menos dos motivos.
¿Qué pasaba en el test del try/catch y qué hace expect.assertions(1)?
O4 · Un componente presentacional: la tarjeta (demos 05 y 06)
Fichero src/catalog/coffee-card.spec.tsx.

🛠️ Qué probar

Muestra el nombre del café como encabezado de nivel 3 (getByRole('heading', { level: 3, name: … })).
Muestra el precio final con el descuento aplicado (Etiopía: "13.41 €") y la etiqueta "-10 %".
Un café sin descuento no muestra ninguna etiqueta de descuento (queryByText).
Al pulsar el botón, llama a onAdd una vez y con ese café. Usad vi.fn() para onAdd y userEvent.click.
💡 Buscad los elementos como lo haría una persona: por su rol y su nombre accesible (getByRole('button', { name: … })), no por clases ni por la estructura del HTML (¿Qué consulta uso?).

💥 Romped el código

En coffee-card.tsx, cambiad onAdd(coffee) por onAdd({ ...coffee, price: 0 }). Algún test tiene que ponerse rojo.
📝 Qué responder

¿Por qué es mejor getByRole('button', { name: 'Añadir Colombia Huila al carrito' }) que buscar "el primer button de la tarjeta"? ¿Qué tiene que ver con la accesibilidad?
¿Cuándo usáis getBy… y cuándo queryBy…?
O5 · Un componente con datos: el catálogo (demos 07 y 08)
Fichero src/catalog/coffee-catalog.spec.tsx. Aquí el componente llama a getCoffees al montarse: la sustituís con un spy, igual que en la demo 08.

import * as api from './coffee.api';

vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);
🛠️ Qué probar

Carga: al principio se ve "Cargando…"; después aparecen 3 elementos de lista (findAllByRole('listitem')) y "Cargando…" ha desaparecido. getCoffees se ha llamado una vez.
Error: si getCoffees rechaza con new Error('Servicio no disponible'), aparece una alerta (role="alert") con ese texto.
Buscador: escribid "bra" en el campo Buscar (findByLabelText): queda un único café, Brasil Cerrado. Borrad y escribid "zzz": aparece "Sin resultados" y no hay elementos de lista.
Carrito (integración): el botón "Vaciar carrito" empieza desactivado. Añadid Etiopía y Brasil: se lee "2 bolsas · 23.91 €" y el botón se activa. Pulsadlo: "0 bolsas · 0.00 €".
💡 El caso 4 prueba a la vez el catálogo, la tarjeta, el hook y las funciones del carrito, sin mockear nada de eso. Es un test de integración, como el de la demo 07.

💥 Romped el código

En coffee-catalog.tsx, quitad el .toLowerCase() de c.name (el nombre del café). Algún test tiene que ponerse rojo. 🤔 ¿Y si lo quitáis de filter? ¿Por qué no falla ningún test? ¿Qué test añadiríais para que fallase?
Quitad disabled={units === 0} del botón. Algún test tiene que ponerse rojo.
📝 Qué responder

¿Por qué aquí necesitáis findBy… (con await) y en O4 bastaba con getBy…?
En el caso 4 no habéis mockeado ni el hook ni el carrito. ¿Qué ventaja tiene? ¿Y qué inconveniente?
O6 · Un custom hook: useCart (demo 09)
Fichero src/catalog/use-cart.spec.ts. Probad el hook sin ningún componente, con renderHook.

🛠️ Qué probar

Al empezar: cart vacío, units 0 y total 0.
Después de añadir dos veces Brasil (dos act seguidos): units 2 y total 21.
Después de añadir un café y vaciar: units 0.
Dos add dentro del mismo act: units tiene que ser 2.
💥 Romped el código

En use-cart.ts, cambiad add para que use el valor del render en lugar de la función de actualización: setCart(addToCart(cart, coffee.id)). ¿Qué test se pone rojo? (Es la trampa de "sumar tres" de la sesión 02 de React).
📝 Qué responder

¿Para qué sirve act? ¿Qué pasaba en la demo 09 sin él?
Según el 💥: ¿por qué el caso 4 detecta el fallo y el caso 2 no?
O7 · README + bitácora de IA
El README.md del repo tiene que incluir:

Cómo ejecutar los tests: en modo vigilancia y una sola vez.
La salida final de npx vitest run (el resumen con ficheros y número de tests), pegada en un bloque de código.
Una tabla con cada 💥: qué cambiasteis y qué test se puso en rojo.
Las respuestas 📝 de O1 a O6.
Checklist de obligatorios / opcionales / desafíos hechos.
🤖 Bitácora de IA: qué herramienta(s) habéis usado y al menos 3 ejemplos con este formato:
### Prompt

"Escríbeme los tests de CoffeeCard"

### Qué me dio

Tests con container.querySelector('button') y un snapshot de toda la tarjeta.

### Qué corregí y por qué

Los cambié a getByRole con el nombre del botón, y quité el snapshot: con el 💥 de O4
el snapshot no detectaba que onAdd recibía otro café, porque no cambia el HTML.
💡 Lo interesante de la bitácora no es que la IA lo hiciera bien, sino lo que tuvisteis que arreglar. Y con los tests hay una pregunta extra: ¿los tests de la IA fallaban cuando rompíais el código?

⭐ Parte 2 · Opcionales
Suben nota. Haced los que más os apetezcan (recomendamos al menos 2).

P1 · Cobertura
Instalad @vitest/coverage-v8 y ejecutad npx vitest run -c ./config/test/config.ts --coverage. Abrid el informe HTML (coverage/index.html) y buscad las líneas que no están cubiertas. Escribid los tests que faltan (por ejemplo, remove de useCart). Explicad en el README por qué un 100 % de cobertura no significa que el código esté bien probado (pensad en los 💥).

P2 · Snapshots: a favor y en contra
Añadid a coffee-card.spec.tsx un test con toMatchSnapshot() (demo 05). Repetid el 💥 de O4: ¿lo detecta el snapshot? Ahora cambiad el texto del botón: ¿qué pasa? Contad en el README cuándo os parece útil un snapshot y cuándo es peligroso.

P3 · Temporizadores falsos ⏱️
Añadid este hook a src/catalog y probadlo (demo 11):

import React from 'react';

export const useOfferCountdown = (seconds: number) => {
  const [left, setLeft] = React.useState(seconds);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { left, finished: left === 0 };
};
Con vi.useFakeTimers() y vi.advanceTimersByTime() dentro de act: que empiece en el valor indicado, que baje uno por segundo, que se quede en 0 (no negativo) con finished: true, y que llame a clearInterval al desmontar. Los tests no tienen que esperar ningún segundo de verdad.

P4 · Context: un carrito compartido
Convertid useCart en un CartProvider con Context (como el opcional P1 del laboratorio 4) y probad el hook con renderHook(…, { wrapper: CartProvider }) (demo 12). Comprobad también qué pasa si se usa el hook sin el provider.

P5 · Probad vuestro laboratorio de React
Volved a vuestro proyecto del laboratorio 4 y escribid tests para el formulario de alta de cafés: con un nombre de un carácter muestra el error y no llama a onSave; con datos válidos, llama a onSave con los valores. Ojo con el precio: es un <input type="number">.

P6 · Depurar un test
Poned un breakpoint dentro de addToCart y ejecutad un test desde la JavaScript Debug Terminal de VS Code (demo 03). Haced una captura parados en el breakpoint y explicad cómo ejecutar un solo fichero de tests y un solo test (it.only, el filtro p del modo vigilancia).

🔥 Parte 3 · Desafíos
Para quien quiera sufrir un poco (y aprender mucho). Cada uno cuenta como un plus importante.

D1 · TDD: primero el test
Hay que añadir cupones de descuento al carrito. Las reglas:

applyCoupon(total: number, code: string): number.
"CAFE10" descuenta un 10 %. "ENVIO" resta 3,90 €, pero el total nunca baja de 0.
Los códigos no distinguen mayúsculas ni espacios a los lados (" cafe10 " vale).
Un código desconocido lanza un error "Cupón no válido".
Escribid primero todos los tests (en rojo), haced un commit, y después la función hasta ponerlos en verde, con otro commit. En la revisión miraremos el orden de los commits.

D2 · Simular la red con MSW
En lugar de espiar fetch, usad Mock Service Worker para simular el servidor en los tests de getCoffees y del catálogo. Comparad en el README los dos enfoques: qué estáis probando en cada caso y qué ventaja tiene MSW cuando cambia la forma de llamar a la API (por ejemplo, si mañana usáis axios).

D3 · Los tests en cada push
Configurad GitHub Actions para que, en cada push y en cada pull request, se ejecuten npm ci, npm run type-check y los tests. Poned la insignia (badge) del resultado en el README. Demostrad que funciona con una pull request que rompa un test.

🤖 Cómo sacarle partido a la IA (sin que os la cuele)
Dadle contexto y pedidle casos, no sólo código. Un buen primer paso es pedirle la lista de casos que probaría, revisarla, y sólo después el código:

Uso Vitest 5 con globals, jsdom, Testing Library y user-event 14. Este es mi
componente: [pegad coffee-catalog.tsx]. getCoffees viene de './coffee.api'.

Antes de escribir código, dame la lista de casos que probarías, con el nombre
de cada test en castellano. Usa consultas por rol y por label, nada de
querySelector ni de clases CSS.
Pedidle que os explique, no sólo que haga: "¿por qué este test necesita await?", "¿qué pasaría con este test si el componente no llamase a la API?", "¿este test fallaría si quito el descuento?".

Revisad siempre esta lista, porque es lo que la IA suele hacer mal:

❌ Lo que suele hacer	✅ Qué hacer
Jest (jest.fn(), jest.mock, jest.config.js)	Vitest: vi.fn(), vi.spyOn, vi.mock, config/test/config.ts
container.querySelector('.card button')	screen.getByRole('button', { name: … })
fireEvent.change para escribir en un input	userEvent.type (demo 06)
getBy… para algo que aparece tras una petición	await screen.findBy…
getBy… para comprobar que algo no está	queryBy… + not.toBeInTheDocument()
try/catch sin expect.assertions	await expect(promesa).rejects.toThrow(…)
expect(…).rejects sin await	Siempre con await
toBe con objetos y arrays, o con decimales	toEqual para contenido; toBeCloseTo para decimales
Un snapshot de todo el componente "para cubrirlo"	Comprobaciones concretas de lo que importa
Mockear todo (el hook, el carrito, la tarjeta…)	Mockear sólo lo que sale del proceso: la red, el tiempo
Tests que comprueban detalles internos (el estado, cuántas veces se renderiza)	Comprobar lo que ve y hace la persona usuaria
Romped el código (💥) cada vez que la IA os dé un test. Es la forma más rápida de saber si sirve.

📬 Entrega
Repositorio público en GitHub (o privado dando acceso a los profesores).
En la raíz: el proyecto + el README.md de O7.
En el portal academia.lemoncode.net id a los laboratorios del módulo 6 y pegad el enlace a vuestro repo.
✋ No subáis node_modules ni coverage.

📊 Evaluación
Bloque	Peso
Obligatorios O1-O6 (los tests pasan y detectan los 💥)	50 %
README: salida de los tests, tabla de 💥, respuestas y bitácora (O7)	15 %
Opcionales (P1-P6)	20 %
Desafíos (D1-D3)	15 %
Para aprobar: todos los obligatorios hechos, los tests en verde y cada 💥 detectado por algún test.

En la revisión podemos romper el código nosotros (un cambio distinto a los 💥) y ver si vuestros tests lo detectan, o pediros que escribáis un test pequeño en directo (p. ej. "que removeFromCart no modifica el carrito" o "que el buscador no distingue mayúsculas"). Es la forma de comprobar que los tests son vuestros, los haya escrito quien los haya escrito.

📚 Recursos
Los apuntes del módulo: 06-testing. Cada obligatorio indica la demo.
Vitest: en especial Mocking y la API de expect.
Testing Library: consultas y su prioridad y user-event.
Common mistakes with React Testing Library, de Kent C. Dodds.
jest-dom: la lista de matchers (toBeInTheDocument, toBeDisabled, toHaveTextContent…).
¡A probar! ☕✅