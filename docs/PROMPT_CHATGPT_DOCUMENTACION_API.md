# PROMPT PARA CHATGPT - Generación de Informe de Documentación de APIs

---

## COPIA TODO EL CONTENIDO DEBAJO DE ESTA LÍNEA Y PÉGALO EN CHATGPT:

---

Actúa como un ingeniero de software senior especializado en documentación técnica. Necesito que generes un **informe profesional de Documentación de APIs e Integración** para mi proyecto de evaluación universitaria.

## CONTEXTO DEL PROYECTO

**Nombre del Proyecto:** Sistema de Gestión de Biblioteca
**Tipo:** Aplicación web con arquitectura de microservicios
**Propósito:** Sistema para gestionar libros, usuarios y préstamos de una biblioteca

### TECNOLOGÍAS UTILIZADAS

**Frontend:**
- React 19 con TypeScript
- Vite como bundler
- Bootstrap 5 para estilos
- Puerto: 5173

**Backend:**
- Spring Boot 3.2.0
- Java 17
- Spring Security con JWT
- SpringDoc OpenAPI (Swagger)
- MySQL como base de datos

### ARQUITECTURA DE MICROSERVICIOS

| Microservicio | Puerto | Descripción |
|---------------|--------|-------------|
| user-management-service | 8081 | Autenticación, registro, gestión de usuarios |
| book-catalog-service | 8082 | CRUD de libros, búsqueda, categorías |
| loan-management-service | 8083 | Solicitud, aprobación, devolución de préstamos |
| reports-service | 8084 | Estadísticas y reportes del sistema |

### ROLES DEL SISTEMA

1. **ADMINISTRADOR (ROLE_ADMINISTRADOR)**
   - Acceso total al sistema
   - Gestionar usuarios (ver, editar, eliminar)
   - Gestionar libros (crear, editar, eliminar)
   - Aprobar/rechazar préstamos
   - Ver reportes y estadísticas

2. **USUARIO (ROLE_USUARIO)**
   - Ver catálogo de libros
   - Buscar libros
   - Solicitar préstamos
   - Ver sus préstamos
   - Devolver libros

### ENDPOINTS DEL SISTEMA

#### USER-MANAGEMENT-SERVICE (Puerto 8081)

```
POST   /api/users/login          - Login (público)
       Body: { "email": "string", "password": "string" }
       Response: { "token": "JWT", "user": {...}, "expiresIn": 86400 }

POST   /api/users/register       - Registro (público)
       Body: { "name": "string", "email": "string", "password": "string" }
       Response: { "id": 1, "name": "...", "email": "...", "role": "USUARIO" }

GET    /api/users                - Listar usuarios (Admin + Token)
       Header: Authorization: Bearer {token}
       Response: [{ "id": 1, "name": "...", "email": "...", "role": "..." }]

GET    /api/users/{id}           - Obtener usuario por ID (Token)
PUT    /api/users/{id}           - Actualizar usuario (Token)
DELETE /api/users/{id}           - Eliminar usuario (Admin + Token)

POST   /api/users/validate-token - Validar token JWT
```

#### BOOK-CATALOG-SERVICE (Puerto 8082)

```
GET    /api/books                - Listar libros (público)
       Response: [{ "id": 1, "title": "...", "author": "...", "status": "DISPONIBLE" }]

GET    /api/books/{id}           - Obtener libro por ID (público)
GET    /api/books/search?q=texto - Buscar libros (público)
GET    /api/books/category/{cat} - Filtrar por categoría (público)

POST   /api/books                - Crear libro (Admin + Token)
       Body: { "title": "...", "author": "...", "isbn": "...", "category": "...", "totalCopies": 5 }

PUT    /api/books/{id}           - Actualizar libro (Admin + Token)
DELETE /api/books/{id}           - Eliminar libro (Admin + Token)
```

#### LOAN-MANAGEMENT-SERVICE (Puerto 8083)

```
GET    /api/loans                - Listar préstamos (Admin + Token)
GET    /api/loans/user/{userId}  - Préstamos de un usuario (Token)
GET    /api/loans/{id}           - Obtener préstamo por ID (Token)

POST   /api/loans                - Solicitar préstamo (Token)
       Body: { "userId": 1, "bookId": 1 }
       Response: { "id": 1, "status": "PENDIENTE", "loanDate": "...", "dueDate": "..." }

PATCH  /api/loans/{id}/approve   - Aprobar préstamo (Admin + Token)
PATCH  /api/loans/{id}/reject    - Rechazar préstamo (Admin + Token)
PATCH  /api/loans/{id}/return    - Devolver libro (Token)
```

#### REPORTS-SERVICE (Puerto 8084)

```
GET    /api/reports/dashboard    - Dashboard con estadísticas (Admin + Token)
       Response: { "totalUsers": 50, "totalBooks": 200, "totalLoans": 150, "activeLoans": 45 }

GET    /api/reports/loans        - Reporte de préstamos (Admin + Token)
GET    /api/reports/books        - Reporte de libros más solicitados (Admin + Token)
```

### FLUJO DE AUTENTICACIÓN JWT

```
1. Usuario envía POST /api/users/login con email y password
2. Backend valida credenciales en MySQL
3. Backend genera token JWT con: userId, email, role, exp
4. Frontend recibe: { token: "eyJ...", user: {...}, expiresIn: 86400 }
5. Frontend guarda token en localStorage
6. Para peticiones protegidas, frontend envía:
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
7. Backend valida token y extrae información del usuario
8. Si token válido y usuario tiene permisos → Procesa petición
9. Si token inválido/expirado → Responde 401 Unauthorized
```

### MODELO DE BASE DE DATOS

```
TABLA: users
- id (PK, BIGINT, AUTO_INCREMENT)
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- password_hash (VARCHAR 255)
- role (ENUM: 'USUARIO', 'ADMINISTRADOR')
- status (ENUM: 'ACTIVO', 'BLOQUEADO')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

TABLA: books
- id (PK, BIGINT, AUTO_INCREMENT)
- title (VARCHAR 200)
- author (VARCHAR 100)
- isbn (VARCHAR 20, UNIQUE)
- category (VARCHAR 50)
- description (TEXT)
- cover_url (VARCHAR 500)
- total_copies (INT)
- available_copies (INT)
- status (ENUM: 'DISPONIBLE', 'PRESTADO', 'RESERVADO')
- created_at (TIMESTAMP)

TABLA: loans
- id (PK, BIGINT, AUTO_INCREMENT)
- user_id (FK → users.id)
- book_id (FK → books.id)
- loan_date (DATE)
- due_date (DATE)
- return_date (DATE, NULLABLE)
- status (ENUM: 'PENDIENTE', 'APROBADO', 'RECHAZADO', 'DEVUELTO')
- created_at (TIMESTAMP)
```

### ARCHIVOS DE CONEXIÓN EN FRONTEND

```
src/
├── api/
│   ├── httpClient.ts      → Cliente HTTP base, maneja tokens JWT
│   ├── usersApi.ts        → Funciones para endpoints de usuarios
│   ├── booksApi.ts        → Funciones para endpoints de libros
│   └── loansApi.ts        → Funciones para endpoints de préstamos
├── services/
│   ├── user.service.ts    → Lógica de negocio de usuarios
│   ├── book.service.ts    → Lógica de negocio de libros
│   └── loan.service.ts    → Lógica de negocio de préstamos
└── hooks/
    └── useUser.ts         → Hook React para estado del usuario
```

### CÓDIGOS HTTP UTILIZADOS

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET, PUT, PATCH exitosos |
| 201 | Created | POST exitoso (recurso creado) |
| 204 | No Content | DELETE exitoso |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token inválido o no enviado |
| 403 | Forbidden | Sin permisos para la acción |
| 404 | Not Found | Recurso no existe |
| 500 | Internal Server Error | Error del servidor |

### SWAGGER URLs

- User Service: http://localhost:8081/swagger-ui.html
- Book Service: http://localhost:8082/swagger-ui.html
- Loan Service: http://localhost:8083/swagger-ui.html
- Reports Service: http://localhost:8084/swagger-ui.html

---

## INSTRUCCIONES PARA EL INFORME

Con toda esta información, genera un **documento profesional de Documentación de APIs e Integración** que incluya:

1. **Portada** con título, versión, fecha, nombre del proyecto

2. **Índice** con todas las secciones

3. **Descripción General** del sistema y su propósito

4. **Arquitectura del Sistema** con diagrama ASCII de la arquitectura

5. **Documentación de cada Endpoint** con:
   - URL completa
   - Método HTTP
   - Descripción
   - Parámetros de entrada (con ejemplos JSON)
   - Respuesta esperada (con ejemplos JSON)
   - Códigos de error posibles
   - Si requiere autenticación y qué rol

6. **Flujo de Autenticación** con diagrama de secuencia

7. **Modelo de Base de Datos** con diagrama de entidades

8. **Integración Frontend-Backend** explicando:
   - Cómo el frontend se conecta
   - Archivos involucrados
   - Manejo de errores
   - Almacenamiento del token

9. **Ejemplos de Uso** con casos prácticos:
   - Login de usuario
   - Buscar un libro
   - Solicitar préstamo
   - Admin aprueba préstamo

10. **Pruebas Realizadas** tabla con casos de prueba y resultados

11. **Conclusiones** sobre la integración

El documento debe ser:
- Profesional y bien estructurado
- Con formato Markdown
- Incluir diagramas ASCII donde sea necesario
- Indicar dónde deben ir capturas de pantalla con: **(CAPTURA: descripción)**
- Listo para entregar en una evaluación universitaria

---

## FIN DEL PROMPT

---









