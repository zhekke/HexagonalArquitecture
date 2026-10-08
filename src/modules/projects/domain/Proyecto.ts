// DOMINIO · Entidad
// Una entidad tiene IDENTIDAD (su id) y COMPORTAMIENTO (sus métodos).
// Aquí viven las reglas que siempre se cumplen, venga la petición de HTTP, CLI o worker.
// Ejemplo: "no se puede cerrar un proyecto dos veces" está AQUÍ y no en el controller.
// Esto es lo que en tu arquitectura de capas estaría mezclado dentro del Service.

import { NombreProyecto } from "./NombreProyecto";
import { ProyectoYaCerradoError } from "./errors";

export type EstadoProyecto = "abierto" | "cerrado";

export class Proyecto {
  private constructor(
    readonly id: string,
    readonly nombre: NombreProyecto,
    private estado: EstadoProyecto,
  ) {}

  // Crear un proyecto nuevo: siempre nace "abierto"
  static crear(id: string, nombre: NombreProyecto): Proyecto {
    return new Proyecto(id, nombre, "abierto");
  }

  // Reconstruir un proyecto que ya existía (lo usa el mapper al leer de la BD)
  static reconstruir(id: string, nombre: NombreProyecto, estado: EstadoProyecto): Proyecto {
    return new Proyecto(id, nombre, estado);
  }

  cerrar(): void {
    if (this.estado === "cerrado") throw new ProyectoYaCerradoError(this.id);
    this.estado = "cerrado";
  }

  get estadoActual(): EstadoProyecto {
    return this.estado;
  }
}
