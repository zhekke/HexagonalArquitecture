// INFRAESTRUCTURA · Mapper
// La fila de la BD (plana, con columnas como "name" y "status") NO es lo mismo
// que la entidad de dominio (con value objects y comportamiento).
// El mapper convierte en ambas direcciones.
// Así, si cambias el esquema de la BD, el dominio no se entera.

import { Proyecto } from "../../../domain/Proyecto";
import { NombreProyecto } from "../../../domain/NombreProyecto";

// Forma de la fila tal y como la devuelve Prisma
export interface ProyectoRow {
  id: string;
  name: string;
  status: "abierto" | "cerrado";
}

export const ProyectoMapper = {
  toPersistence(p: Proyecto): ProyectoRow {
    return { id: p.id, name: p.nombre.value, status: p.estadoActual };
  },

  toDomain(row: ProyectoRow): Proyecto {
    return Proyecto.reconstruir(row.id, NombreProyecto.create(row.name), row.status);
  },
};
