// APLICACIÓN · Caso de uso
// Un caso de uso = UNA cosa que el usuario puede hacer ("crear proyecto").
// Su trabajo es ORQUESTAR: decidir el orden de los pasos.
//   1. recibe datos  2. carga cosas (vía ports)  3. delega las reglas en el dominio
//   4. guarda (vía ports)  5. devuelve resultado
//
// Equivalencia: es la parte de "orquestación" de tu Service.
// Las reglas puras (nombre válido, no cerrar dos veces) las has movido al dominio.
//
// Fíjate en los imports: NO hay Prisma, NO hay Fastify, NO hay req/reply.
// Solo conoce interfaces (ports). Por eso se puede probar sin base de datos.

import { NombreProyecto } from "../../domain/NombreProyecto";
import { Proyecto } from "../../domain/Proyecto";
import { ProyectoDuplicadoError } from "../../domain/errors";
import { ProyectoRepository } from "../ports/ProyectoRepository";
import { IdGenerator } from "../../../../shared/application/ports/IdGenerator";

// Estos son los "DTO": datos de entrada y salida del caso de uso.
// Se definen junto al caso de uso (no en ports/).
export interface CrearProyectoInput {
  nombre: string;
}
export interface CrearProyectoOutput {
  id: string;
}

export class CrearProyecto {
  constructor(
    private readonly proyectos: ProyectoRepository, // port (interfaz)
    private readonly ids: IdGenerator, // port (interfaz)
  ) {}

  async execute(input: CrearProyectoInput): Promise<CrearProyectoOutput> {
    // 1. El dominio valida el nombre (lanza error si no es válido)
    const nombre = NombreProyecto.create(input.nombre);

    // 2. Regla de negocio que necesita consultar datos: la orquesta el caso de uso
    if (await this.proyectos.existeConNombre(nombre)) {
      throw new ProyectoDuplicadoError(nombre.value);
    }

    // 3. El dominio crea la entidad
    const proyecto = Proyecto.crear(this.ids.next(), nombre);

    // 4. Se guarda a través del port (no sabemos si es Prisma, memoria...)
    await this.proyectos.guardar(proyecto);

    return { id: proyecto.id };
  }
}
