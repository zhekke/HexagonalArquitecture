# Proyecto: para explicar la arquitectura hexagonal

Proyecto de ejemplo (solo para leer, no está pensado para ejecutarse) con UN módulo, `projects`, y UNA acción: crear proyecto.
Cada fichero tiene comentarios que explican qué hace y por qué está ahí.

## Estructura

```
src/
├── main.http.ts                  ← punto de entrada: arranca el servidor
├── bootstrap/                    ← COMPOSITION ROOT: aquí se conecta todo
│   └── http/
│       ├── server.ts             ← crea adaptadores, los inyecta en los casos de uso, registra rutas
│       └── errors.ts             ← traduce errores de dominio a 400/409/500
├── shared/                       ← lo común a todos los módulos (mismas capas)
│   ├── domain/errors/DomainError.ts
│   ├── application/ports/IdGenerator.ts       ← port (interfaz)
│   └── infrastructure/UuidGenerator.ts        ← adaptador (implementación)
├── modules/
│   └── projects/                 ← UN hexágono = un módulo de negocio
│       ├── index.ts              ← la única puerta pública del módulo
│       ├── domain/               ← reglas de negocio puras (sin imports externos)
│       │   ├── Proyecto.ts            (entidad)
│       │   ├── NombreProyecto.ts      (value object)
│       │   └── errors.ts              (errores de negocio)
│       ├── application/
│       │   ├── use-cases/
│       │   │   └── CrearProyecto.ts   (orquesta el flujo)
│       │   └── ports/
│       │       └── ProyectoRepository.ts   (interfaz: lo que la app necesita de fuera)
│       ├── infrastructure/       ← lado que SALE: implementa los ports
│       │   └── persistence/prisma/
│       │       ├── PrismaProyectoRepository.ts
│       │       └── ProyectoMapper.ts
│       └── interfaces/           ← lado que ENTRA: llama a la aplicación
│           └── http/
│               └── proyectosRoutes.ts      (ruta + controller)
└── test/
    ├── fakes/InMemoryProyectoRepository.ts  ← otra implementación del mismo port
    └── CrearProyecto.test.ts
```

## Tu arquitectura en capas -> hexagonal

| Lo que conoces | Dónde está aquí |
|---|---|
| Routes + Controller + Validation (formato) | `interfaces/http/proyectosRoutes.ts` |
| Service (reglas) | `domain/` (Proyecto, NombreProyecto) |
| Service (orquestación) | `application/use-cases/CrearProyecto.ts` |
| Repository (interfaz) | `application/ports/ProyectoRepository.ts` |
| Repository (Prisma) | `infrastructure/persistence/prisma/PrismaProyectoRepository.ts` |
| (no existía) | `bootstrap/` conecta todo; `ProyectoMapper` convierte fila <-> entidad |

## Recorrido de `POST /projects { "nombre": "Reforma oficina" }`

1. `main.http.ts` arranca el servidor (montado por `bootstrap/http/server.ts`).
2. `proyectosRoutes.ts` recibe la petición, valida el formato y llama a `crearProyecto.execute()`.
3. `CrearProyecto.ts`:
   - `NombreProyecto.create()` valida el nombre (dominio).
   - `proyectos.existeConNombre()` consulta por el port; en ejecución lo atiende `PrismaProyectoRepository`.
   - `Proyecto.crear()` crea la entidad (dominio).
   - `proyectos.guardar()` guarda por el port; `ProyectoMapper` convierte entidad a fila.
4. Se responde `201 { id }`.
5. Si el nombre ya existía, se lanza `ProyectoDuplicadoError`; `bootstrap/http/errors.ts` lo convierte en `409`.

## Regla de dependencias (los import solo apuntan hacia dentro)

```
interfaces/     -> application -> domain
infrastructure/ -> application/ports + domain
bootstrap/      -> todo (ensambla)
domain          -> no importa nada
```

Compruébalo: abre `CrearProyecto.ts` y verás que no importa Prisma ni Fastify. Abre `PrismaProyectoRepository.ts` y verás que importa el port de la aplicación, no al revés. Esa es la inversión de dependencias.
