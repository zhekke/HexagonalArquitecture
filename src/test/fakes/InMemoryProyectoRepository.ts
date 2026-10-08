// TESTS · Fake
// Otro "cable" para el mismo "enchufe": implementa ProyectoRepository, pero guarda en un array.
// Gracias a que el caso de uso depende de la interfaz, se puede cambiar Prisma por esto
// sin tocar ni una línea del caso de uso.

import { ProyectoRepository } from "../../modules/projects/application/ports/ProyectoRepository";
import { Proyecto } from "../../modules/projects/domain/Proyecto";
import { NombreProyecto } from "../../modules/projects/domain/NombreProyecto";

export class InMemoryProyectoRepository implements ProyectoRepository {
  private items: Proyecto[] = [];

  async guardar(p: Proyecto) {
    this.items = this.items.filter((x) => x.id !== p.id);
    this.items.push(p);
  }
  async buscarPorId(id: string) {
    return this.items.find((x) => x.id === id) ?? null;
  }
  async existeConNombre(nombre: NombreProyecto) {
    return this.items.some((x) => x.nombre.value === nombre.value);
  }
}
