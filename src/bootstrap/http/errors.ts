// BOOTSTRAP · Traducción de errores de dominio a HTTP
// El dominio lanza errores de negocio sin saber qué es un 404 o un 409.
// Aquí, en el borde HTTP, se traducen a códigos de estado.

import { FastifyInstance } from "fastify";
import { DomainError } from "../../shared/domain/errors/DomainError";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof DomainError) {
      const status = error.name === "ProyectoDuplicadoError" ? 409 : 400;
      return reply.code(status).send({ error: error.message });
    }
    return reply.code(500).send({ error: "Error interno" });
  });
}
