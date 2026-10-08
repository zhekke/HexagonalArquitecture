// TEST del caso de uso: sin Docker, sin base de datos, sin HTTP. Corre en milisegundos.
// En una arquitectura en capas tendrías que mockear Prisma o levantar una BD real.

import { describe, it, expect } from "vitest";
import { CrearProyecto } from "../modules/projects/application/use-cases/CrearProyecto";
import { ProyectoDuplicadoError } from "../modules/projects/domain/errors";
import { InMemoryProyectoRepository } from "./fakes/InMemoryProyectoRepository";

const idFijo = { next: () => "p-1" }; // fake de IdGenerator en una línea

describe("CrearProyecto", () => {
  it("crea un proyecto y devuelve su id", async () => {
    const useCase = new CrearProyecto(new InMemoryProyectoRepository(), idFijo);
    const result = await useCase.execute({ nombre: "Reforma oficina" });
    expect(result).toEqual({ id: "p-1" });
  });

  it("no permite dos proyectos con el mismo nombre", async () => {
    const useCase = new CrearProyecto(new InMemoryProyectoRepository(), idFijo);
    await useCase.execute({ nombre: "Reforma" });
    await expect(useCase.execute({ nombre: "Reforma" })).rejects.toThrow(ProyectoDuplicadoError);
  });
});
