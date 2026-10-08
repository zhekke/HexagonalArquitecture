// PUNTO DE ENTRADA
// Es el fichero que se ejecuta al arrancar el servidor (como el main() de Java o C).
// No contiene lógica: solo arranca. Todo el montaje está en bootstrap/.
// En el proyecto real hay también main.worker.ts y main.cli.ts (otras formas de arrancar el mismo código).

import { buildServer } from "./bootstrap/http/server";

const app = buildServer();
await app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
console.log("API escuchando");
