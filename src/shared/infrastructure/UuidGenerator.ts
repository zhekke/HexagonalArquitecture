// SHARED · Adaptador secundario
// Implementación real del puerto IdGenerator.

import { randomUUID } from "node:crypto";
import { IdGenerator } from "../application/ports/IdGenerator";

export class UuidGenerator implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}
