// DOMINIO · Errores de negocio
// Describen QUÉ ha ido mal en el negocio, sin saber nada de HTTP.
// El dominio no sabe qué es un 404 o un 409: esa traducción la hace bootstrap.

import { DomainError } from "../../../shared/domain/errors/DomainError";

export class NombreProyectoInvalidoError extends DomainError {
  constructor(nombre: string) {
    super(`El nombre "${nombre}" no es válido (entre 3 y 80 caracteres)`);
  }
}

export class ProyectoDuplicadoError extends DomainError {
  constructor(nombre: string) {
    super(`Ya existe un proyecto llamado "${nombre}"`);
  }
}

export class ProyectoYaCerradoError extends DomainError {
  constructor(id: string) {
    super(`El proyecto ${id} ya está cerrado`);
  }
}
