// APLICACIÓN · Puerto (port)
// Un puerto es una INTERFAZ: dice QUÉ necesita la aplicación, no CÓMO se hace.
// NO es un DTO. Es el "enchufe": define la forma del agujero.
// Lo define la aplicación (quien lo necesita) y lo implementa la infraestructura.
//
// Equivalencia con lo que conoces: es la parte "interfaz" de tu Repository.
// La parte "Prisma" está en infrastructure/persistence/prisma/PrismaProyectoRepository.ts

import { Proyecto } from "../../domain/Proyecto";
import { NombreProyecto } from "../../domain/NombreProyecto";

export interface ProyectoRepository {
  guardar(proyecto: Proyecto): Promise<void>;
  buscarPorId(id: string): Promise<Proyecto | null>;
  existeConNombre(nombre: NombreProyecto): Promise<boolean>;
}
