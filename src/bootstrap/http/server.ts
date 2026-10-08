// BOOTSTRAP · Composition root
// Es el ÚNICO sitio que conoce todas las capas a la vez.
// Aquí se hacen los "new" y se conectan las piezas (inyección de dependencias):
//   adaptador secundario (Prisma)  ->  caso de uso  ->  adaptador primario (rutas HTTP)
// Por eso está FUERA de modules/: no pertenece a ningún hexágono, los ensambla.

import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { CrearProyecto, PrismaProyectoRepository, proyectosRoutes } from "../../modules/projects";
import { UuidGenerator } from "../../shared/infrastructure/UuidGenerator";
import { registerErrorHandler } from "./errors";

export function buildServer() {
  const app = Fastify();
  registerErrorHandler(app);

  // 1. Creamos los adaptadores secundarios (lo que sale hacia fuera)
  const prisma = new PrismaClient();
  const proyectoRepo = new PrismaProyectoRepository(prisma);
  const ids = new UuidGenerator();

  // 2. Los inyectamos en el caso de uso (que solo conoce las interfaces)
  const crearProyecto = new CrearProyecto(proyectoRepo, ids);

  // 3. Registramos el adaptador primario (las rutas) pasándole el caso de uso
  proyectosRoutes(app, crearProyecto);

  return app;
}