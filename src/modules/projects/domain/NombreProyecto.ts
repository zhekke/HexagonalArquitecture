// DOMINIO · Value Object
// Un "value object" es un dato con reglas propias, inmutable y sin identidad.
// Si tienes un NombreProyecto en la mano, YA sabes que es válido.
// Fíjate: no importa nada externo (ni Prisma, ni Fastify, ni librerías). TypeScript puro.

import { NombreProyectoInvalidoError } from "./errors";

export class NombreProyecto {
  private constructor(readonly value: string) {}

  static create(raw: string): NombreProyecto {
    const limpio = (raw ?? "").trim();
    if (limpio.length < 3 || limpio.length > 80) {
      throw new NombreProyectoInvalidoError(raw);
    }
    return new NombreProyecto(limpio);
  }
}
