// SHARED · Puerto
// ¿Por qué un puerto para generar ids y no llamar a randomUUID() directamente?
// Para que en los tests puedas pasar un generador fijo ("p-1") y comprobar resultados exactos.
// Lo mismo pasa con un puerto Clock en lugar de usar new Date().

export interface IdGenerator {
  next(): string;
}
