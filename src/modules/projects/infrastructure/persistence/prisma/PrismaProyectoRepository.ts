// INFRAESTRUCTURA · Adaptador secundario (el "cable" que encaja en el "enchufe")
// Implementa el port ProyectoRepository usando Prisma.
// Aquí SÍ se puede importar Prisma: es el único sitio permitido.
//
// Importante: Prisma NO es toda la infraestructura. Aquí también irían
// el envío de emails, Google Drive, colas, cifrado, el reloj, etc.
// Todo lo que habla con el mundo exterior y implementa un port.

import { PrismaClient } from "@prisma/client";
import { ProyectoRepository } from "../../../application/ports/ProyectoRepository";
import { Proyecto } from "../../../domain/Proyecto";
import { NombreProyecto } from "../../../domain/NombreProyecto";
import { ProyectoMapper } from "./ProyectoMapper";

export class PrismaProyectoRepository implements ProyectoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async guardar(proyecto: Proyecto): Promise<void> {
    const row = ProyectoMapper.toPersistence(proyecto); // entidad -> fila
    await this.prisma.project.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  async buscarPorId(id: string): Promise<Proyecto | null> {
    const row = await this.prisma.project.findUnique({ where: { id } });
    return row ? ProyectoMapper.toDomain(row) : null; // fila -> entidad
  }

  async existeConNombre(nombre: NombreProyecto): Promise<boolean> {
    const count = await this.prisma.project.count({ where: { name: nombre.value } });
    return count > 0;
  }
}
