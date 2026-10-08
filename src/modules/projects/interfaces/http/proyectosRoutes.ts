// INTERFACES · Adaptador primario (lado que ENTRA)
// Es lo que en tu mundo llamas Routes + Controller + Validation (formato del body).
// Su único trabajo es TRADUCIR:  petición HTTP  ->  llamada al caso de uso  ->  respuesta HTTP
// No contiene lógica de negocio.
//
// Otros adaptadores primarios serían un comando de CLI o un job del worker:
// los tres podrían llamar al mismo CrearProyecto.

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { CrearProyecto } from "../../application/use-cases/CrearProyecto";

// Validación del FORMATO del body (¿viene un string?). Es la parte "DTO de entrada" en HTTP.
// Las reglas de NEGOCIO (longitud del nombre, duplicados) NO se validan aquí, sino en dominio/aplicación.
const crearProyectoSchema = z.object({
  nombre: z.string(),
});

export function proyectosRoutes(app: FastifyInstance, crearProyecto: CrearProyecto) {
  // Ruta del endpoint + handler (route y controller juntos)
  app.post("/projects", async (req, reply) => {
    const body = crearProyectoSchema.parse(req.body); // HTTP -> datos
    const result = await crearProyecto.execute(body); // llama al caso de uso
    return reply.code(201).send(result); // resultado -> HTTP
  });
}
