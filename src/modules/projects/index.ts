// API PÚBLICA DEL MÓDULO ("la única puerta")
// Otros módulos (accounts, documents...) solo pueden importar desde AQUÍ,
// nunca desde modules/projects/domain/Proyecto.ts directamente.
// Así projects puede reorganizar su interior sin romper a los demás.
// Esa regla se comprueba automáticamente con dependency-cruiser en CI.

export { CrearProyecto } from "./application/use-cases/CrearProyecto";
export type { ProyectoRepository } from "./application/ports/ProyectoRepository";
export { PrismaProyectoRepository } from "./infrastructure/persistence/prisma/PrismaProyectoRepository";
export { proyectosRoutes } from "./interfaces/http/proyectosRoutes";
