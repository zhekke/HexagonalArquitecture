// SHARED · DOMINIO
// Clase base de todos los errores de negocio, común a todos los módulos.
// bootstrap/http/errors.ts la usa para saber que un error es "de negocio".

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
