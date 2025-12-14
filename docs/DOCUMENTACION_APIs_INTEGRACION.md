# Documentación de APIs e Integración

## Sistema de Gestión de Biblioteca

**Título:** Documentación de API para Sistema de Gestión de Biblioteca  
**Versión del Documento:** 1.0  
**Fecha de Creación:** 28/11/2024  
**Equipo:** [Nombre del equipo]

---

## 1. Descripción General

Este documento proporciona una descripción detallada de los endpoints de la API diseñados para gestionar el Sistema de Gestión de Biblioteca. Está dirigido a desarrolladores y administradores de sistemas que interactúan con los microservicios del backend.

El sistema permite:
- Gestión de usuarios (registro, login, roles)
- Catálogo de libros (CRUD completo)
- Sistema de préstamos (solicitar, aprobar, devolver)
- Generación de reportes

---

## 2. Información General

### 2.1 URLs de los Microservicios

| Microservicio | URL Base | Puerto | Descripción |
|---------------|----------|--------|-------------|
| **User Management** | `http://localhost:8081/api` | 8081 | Gestión de usuarios y autenticación |
| **Book Catalog** | `http://localhost:8082/api` | 8082 | Catálogo de libros |
| **Loan Management** | `http://localhost:8083/api` | 8083 | Gestión de préstamos |
| **Reports** | `http://localhost:8084/api` | 8084 | Reportes y estadísticas |

### 2.2 URLs de Swagger (Documentación Interactiva)

| Microservicio | URL Swagger |
|---------------|-------------|
| User Management | http://localhost:8081/swagger-ui.html |
| Book Catalog | http://localhost:8082/swagger-ui.html |
| Loan Management | http://localhost:8083/swagger-ui.html |
| Reports | http://localhost:8084/swagger-ui.html |

### 2.3 Tecnologías Utilizadas

- **Backend:** Spring Boot 3.2.0, Java 17
- **Frontend:** React 19, TypeScript, Vite
- **Base de Datos:** MySQL
- **Autenticación:** JWT (JSON Web Token)
- **Documentación API:** SpringDoc OpenAPI (Swagger)

---

## 3. Autenticación y Seguridad

### 3.1 Sistema de Autenticación JWT

El sistema utiliza **JSON Web Tokens (JWT)** para la autenticación. El flujo es:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario envía credenciales (email + password)               │
│                      ↓                                          │
│  2. Backend valida credenciales en MySQL                        │
│                      ↓                                          │
│  3. Backend genera JWT con datos del usuario                    │
│                      ↓                                          │
│  4. Frontend guarda token en localStorage                       │
│                      ↓                                          │
│  5. Frontend envía token en header de cada petición             │
│     Authorization: Bearer {token}                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Roles del Sistema

| Rol | Código | Permisos |
|-----|--------|----------|
| **Administrador** | `ROLE_ADMINISTRADOR` | Acceso total: gestionar usuarios, libros, préstamos, reportes |
| **Usuario** | `ROLE_USUARIO` | Ver catálogo, solicitar préstamos, ver sus préstamos |

### 3.3 Estructura del Token JWT

```json
{
  "sub": "admin@biblioteca.com",
  "userId": 1,
  "role": "ADMINISTRADOR",
  "iat": 1699999999,
  "exp": 1700086399
}
```

---

## 4. Documentación de Endpoints

### 4.1 USER MANAGEMENT SERVICE (Puerto 8081)

#### 4.1.1 Autenticación

##### POST /api/users/login

| Campo | Valor |
|-------|-------|
| **Descripción** | Inicia sesión y obtiene token JWT |
| **Método** | POST |
| **URL** | `http://localhost:8081/api/users/login` |
| **Autenticación** | No requerida |
| **Content-Type** | application/json |

**Datos de Entrada:**
```json
{
  "email": "admin@biblioteca.com",
  "password": "admin123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@biblioteca.com",
    "role": "ADMINISTRADOR",
    "roleFrontend": "Admin"
  },
  "expiresIn": 86400
}
```

**Respuestas de Error:**
| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos |
| 401 | Credenciales incorrectas |
| 500 | Error del servidor |

**(CAPTURA DE PANTALLA: Mostrar Postman/Swagger con petición de login exitosa)**

---

##### POST /api/users/register

| Campo | Valor |
|-------|-------|
| **Descripción** | Registra un nuevo usuario |
| **Método** | POST |
| **URL** | `http://localhost:8081/api/users/register` |
| **Autenticación** | No requerida |
| **Content-Type** | application/json |

**Datos de Entrada:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 2,
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "role": "USUARIO",
  "roleFrontend": "User",
  "status": "ACTIVO"
}
```

**Respuestas de Error:**
| Código | Descripción |
|--------|-------------|
| 400 | Email ya registrado o datos inválidos |
| 500 | Error del servidor |

**(CAPTURA DE PANTALLA: Mostrar formulario de registro en el frontend y respuesta exitosa)**

---

#### 4.1.2 Gestión de Usuarios

##### GET /api/users

| Campo | Valor |
|-------|-------|
| **Descripción** | Obtiene lista de todos los usuarios |
| **Método** | GET |
| **URL** | `http://localhost:8081/api/users` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |
| **Header requerido** | `Authorization: Bearer {token}` |

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "Administrador",
    "email": "admin@biblioteca.com",
    "role": "ADMINISTRADOR",
    "status": "ACTIVO"
  },
  {
    "id": 2,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "USUARIO",
    "status": "ACTIVO"
  }
]
```

**Respuestas de Error:**
| Código | Descripción |
|--------|-------------|
| 401 | Token inválido o expirado |
| 403 | Sin permisos (no es Admin) |
| 500 | Error del servidor |

**(CAPTURA DE PANTALLA: Panel de administración mostrando lista de usuarios)**

---

##### GET /api/users/{id}

| Campo | Valor |
|-------|-------|
| **Descripción** | Obtiene un usuario por su ID |
| **Método** | GET |
| **URL** | `http://localhost:8081/api/users/{id}` |
| **Autenticación** | Sí - Token JWT |
| **Parámetro** | `id` - ID del usuario |

**Ejemplo:** `GET /api/users/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "name": "Administrador",
  "email": "admin@biblioteca.com",
  "role": "ADMINISTRADOR",
  "status": "ACTIVO",
  "createdAt": "2024-01-01T00:00:00"
}
```

---

##### PUT /api/users/{id}

| Campo | Valor |
|-------|-------|
| **Descripción** | Actualiza datos de un usuario |
| **Método** | PUT |
| **URL** | `http://localhost:8081/api/users/{id}` |
| **Autenticación** | Sí - Token JWT |
| **Content-Type** | application/json |

**Datos de Entrada:**
```json
{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@ejemplo.com"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 2,
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@ejemplo.com",
  "role": "USUARIO",
  "status": "ACTIVO"
}
```

---

##### DELETE /api/users/{id}

| Campo | Valor |
|-------|-------|
| **Descripción** | Elimina un usuario |
| **Método** | DELETE |
| **URL** | `http://localhost:8081/api/users/{id}` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |

**Respuesta Exitosa (204):** Sin contenido

**Respuestas de Error:**
| Código | Descripción |
|--------|-------------|
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Usuario no encontrado |

---

### 4.2 BOOK CATALOG SERVICE (Puerto 8082)

#### 4.2.1 Consulta de Libros

##### GET /api/books

| Campo | Valor |
|-------|-------|
| **Descripción** | Lista todos los libros del catálogo |
| **Método** | GET |
| **URL** | `http://localhost:8082/api/books` |
| **Autenticación** | No requerida (público) |

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "category": "Programación",
    "description": "Principios para escribir código limpio",
    "coverUrl": "https://ejemplo.com/clean-code.jpg",
    "totalCopies": 5,
    "availableCopies": 3,
    "status": "DISPONIBLE",
    "statusFrontend": "disponible"
  },
  {
    "id": 2,
    "title": "Design Patterns",
    "author": "Gang of Four",
    "isbn": "978-0201633610",
    "category": "Programación",
    "description": "Patrones de diseño de software",
    "coverUrl": "https://ejemplo.com/patterns.jpg",
    "totalCopies": 3,
    "availableCopies": 0,
    "status": "PRESTADO",
    "statusFrontend": "prestado"
  }
]
```

**(CAPTURA DE PANTALLA: Catálogo de libros en el frontend mostrando las cards de libros)**

---

##### GET /api/books/{id}

| Campo | Valor |
|-------|-------|
| **Descripción** | Obtiene detalles de un libro específico |
| **Método** | GET |
| **URL** | `http://localhost:8082/api/books/{id}` |
| **Autenticación** | No requerida |
| **Parámetro** | `id` - ID del libro |

**Ejemplo:** `GET /api/books/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "category": "Programación",
  "description": "Principios para escribir código limpio y mantenible",
  "coverUrl": "https://ejemplo.com/clean-code.jpg",
  "totalCopies": 5,
  "availableCopies": 3,
  "status": "DISPONIBLE"
}
```

**(CAPTURA DE PANTALLA: Vista de detalle de un libro en el frontend)**

---

##### GET /api/books/search?q={query}

| Campo | Valor |
|-------|-------|
| **Descripción** | Busca libros por título o autor |
| **Método** | GET |
| **URL** | `http://localhost:8082/api/books/search?q={query}` |
| **Autenticación** | No requerida |
| **Query Param** | `q` - Texto de búsqueda |

**Ejemplo:** `GET /api/books/search?q=Clean`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Programación",
    "status": "DISPONIBLE"
  }
]
```

**(CAPTURA DE PANTALLA: Barra de búsqueda con resultados filtrados)**

---

#### 4.2.2 Gestión de Libros (Solo Admin)

##### POST /api/books

| Campo | Valor |
|-------|-------|
| **Descripción** | Crea un nuevo libro |
| **Método** | POST |
| **URL** | `http://localhost:8082/api/books` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |
| **Content-Type** | application/json |

**Datos de Entrada:**
```json
{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "isbn": "978-0134757599",
  "category": "Programación",
  "description": "Técnicas de refactorización de código",
  "coverUrl": "https://ejemplo.com/refactoring.jpg",
  "totalCopies": 3
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 3,
  "title": "Refactoring",
  "author": "Martin Fowler",
  "isbn": "978-0134757599",
  "category": "Programación",
  "status": "DISPONIBLE",
  "totalCopies": 3,
  "availableCopies": 3
}
```

**(CAPTURA DE PANTALLA: Formulario de agregar libro y mensaje de éxito)**

---

##### PUT /api/books/{id}

| Campo | Valor |
|-------|-------|
| **Descripción** | Actualiza información de un libro |
| **Método** | PUT |
| **URL** | `http://localhost:8082/api/books/{id}` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |
| **Content-Type** | application/json |

**Datos de Entrada:**
```json
{
  "title": "Clean Code - Segunda Edición",
  "description": "Descripción actualizada",
  "totalCopies": 10
}
```

**Respuestas:**
| Código | Descripción |
|--------|-------------|
| 200 | Libro actualizado exitosamente |
| 400 | Datos inválidos |
| 404 | Libro no encontrado |

**(CAPTURA DE PANTALLA: Modal de edición de libro)**

---

##### DELETE /api/books/{id}

| Campo | Valor |
|-------|-------|
| **Descripción** | Elimina un libro del catálogo |
| **Método** | DELETE |
| **URL** | `http://localhost:8082/api/books/{id}` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |

**Respuesta Exitosa (204):** Sin contenido

---

### 4.3 LOAN MANAGEMENT SERVICE (Puerto 8083)

#### 4.3.1 Consulta de Préstamos

##### GET /api/loans

| Campo | Valor |
|-------|-------|
| **Descripción** | Lista todos los préstamos (Admin) |
| **Método** | GET |
| **URL** | `http://localhost:8083/api/loans` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "userId": 2,
    "userName": "Juan Pérez",
    "bookId": 1,
    "bookTitle": "Clean Code",
    "loanDate": "2024-11-20",
    "dueDate": "2024-12-04",
    "returnDate": null,
    "status": "APROBADO",
    "statusFrontend": "aprobado"
  },
  {
    "id": 2,
    "userId": 3,
    "userName": "María García",
    "bookId": 2,
    "bookTitle": "Design Patterns",
    "loanDate": "2024-11-25",
    "dueDate": "2024-12-09",
    "returnDate": null,
    "status": "PENDIENTE",
    "statusFrontend": "pendiente"
  }
]
```

**(CAPTURA DE PANTALLA: Panel de administración de préstamos)**

---

##### GET /api/loans/user/{userId}

| Campo | Valor |
|-------|-------|
| **Descripción** | Obtiene préstamos de un usuario específico |
| **Método** | GET |
| **URL** | `http://localhost:8083/api/loans/user/{userId}` |
| **Autenticación** | Sí - Token JWT |
| **Parámetro** | `userId` - ID del usuario |

**Ejemplo:** `GET /api/loans/user/2`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "bookId": 1,
    "bookTitle": "Clean Code",
    "loanDate": "2024-11-20",
    "dueDate": "2024-12-04",
    "status": "APROBADO"
  }
]
```

**(CAPTURA DE PANTALLA: Vista "Mis Préstamos" del usuario)**

---

#### 4.3.2 Gestión de Préstamos

##### POST /api/loans

| Campo | Valor |
|-------|-------|
| **Descripción** | Solicita un nuevo préstamo |
| **Método** | POST |
| **URL** | `http://localhost:8083/api/loans` |
| **Autenticación** | Sí - Token JWT |
| **Content-Type** | application/json |

**Datos de Entrada:**
```json
{
  "userId": 2,
  "bookId": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 3,
  "userId": 2,
  "bookId": 1,
  "loanDate": "2024-11-28",
  "dueDate": "2024-12-12",
  "status": "PENDIENTE",
  "message": "Préstamo solicitado. Espera aprobación del administrador."
}
```

**Respuestas de Error:**
| Código | Descripción |
|--------|-------------|
| 400 | Libro no disponible o usuario tiene préstamos pendientes |
| 404 | Libro o usuario no encontrado |

**(CAPTURA DE PANTALLA: Botón "Solicitar Préstamo" y mensaje de confirmación)**

---

##### PATCH /api/loans/{id}/approve

| Campo | Valor |
|-------|-------|
| **Descripción** | Aprueba un préstamo pendiente |
| **Método** | PATCH |
| **URL** | `http://localhost:8083/api/loans/{id}/approve` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |

**Ejemplo:** `PATCH /api/loans/2/approve`

**Respuesta Exitosa (200):**
```json
{
  "id": 2,
  "status": "APROBADO",
  "message": "Préstamo aprobado exitosamente"
}
```

**(CAPTURA DE PANTALLA: Botón "Aprobar" en panel de admin y cambio de estado)**

---

##### PATCH /api/loans/{id}/reject

| Campo | Valor |
|-------|-------|
| **Descripción** | Rechaza un préstamo pendiente |
| **Método** | PATCH |
| **URL** | `http://localhost:8083/api/loans/{id}/reject` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |

**Respuesta Exitosa (200):**
```json
{
  "id": 2,
  "status": "RECHAZADO",
  "message": "Préstamo rechazado"
}
```

**(CAPTURA DE PANTALLA: Botón "Rechazar" y estado actualizado)**

---

##### PATCH /api/loans/{id}/return

| Campo | Valor |
|-------|-------|
| **Descripción** | Registra la devolución de un libro |
| **Método** | PATCH |
| **URL** | `http://localhost:8083/api/loans/{id}/return` |
| **Autenticación** | Sí - Token JWT |

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "status": "DEVUELTO",
  "returnDate": "2024-11-28",
  "message": "Libro devuelto exitosamente"
}
```

**(CAPTURA DE PANTALLA: Botón "Devolver" y confirmación de devolución)**

---

### 4.4 REPORTS SERVICE (Puerto 8084)

##### GET /api/reports/dashboard

| Campo | Valor |
|-------|-------|
| **Descripción** | Obtiene estadísticas generales del sistema |
| **Método** | GET |
| **URL** | `http://localhost:8084/api/reports/dashboard` |
| **Autenticación** | Sí - Token JWT (Solo Admin) |

**Respuesta Exitosa (200):**
```json
{
  "totalUsers": 50,
  "totalBooks": 200,
  "totalLoans": 150,
  "activeLoans": 45,
  "pendingLoans": 12,
  "overdueLoans": 3,
  "popularBooks": [
    {"bookId": 1, "title": "Clean Code", "loanCount": 25},
    {"bookId": 2, "title": "Design Patterns", "loanCount": 18}
  ]
}
```

**(CAPTURA DE PANTALLA: Dashboard de administrador con estadísticas)**

---

## 5. Integración Frontend - Backend

### 5.1 Arquitectura de Conexión

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE INTEGRACIÓN                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                    FRONTEND (React)                         │     │
│  │                  http://localhost:5173                      │     │
│  ├────────────────────────────────────────────────────────────┤     │
│  │                                                             │     │
│  │  src/api/                                                   │     │
│  │  ├── httpClient.ts    → Cliente HTTP base con JWT          │     │
│  │  ├── usersApi.ts      → Conexión a MS-Usuarios             │     │
│  │  ├── booksApi.ts      → Conexión a MS-Libros               │     │
│  │  └── loansApi.ts      → Conexión a MS-Préstamos            │     │
│  │                                                             │     │
│  └─────────────────────────┬──────────────────────────────────┘     │
│                            │                                         │
│                            │ HTTP/REST + JSON                        │
│                            │ Header: Authorization: Bearer {token}   │
│                            │                                         │
│  ┌─────────────────────────▼──────────────────────────────────┐     │
│  │                    BACKEND (Spring Boot)                    │     │
│  ├─────────────────────────────────────────────────────────────┤     │
│  │                                                             │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │     │
│  │  │ MS-Usuarios │  │ MS-Libros   │  │MS-Préstamos │         │     │
│  │  │   :8081     │  │   :8082     │  │   :8083     │         │     │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │     │
│  │         └────────────────┼────────────────┘                │     │
│  │                          │                                  │     │
│  │                   ┌──────▼──────┐                          │     │
│  │                   │    MySQL    │                          │     │
│  │                   │   :3306     │                          │     │
│  │                   └─────────────┘                          │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Archivos de Conexión en el Frontend

#### httpClient.ts - Cliente HTTP Base

**Ubicación:** `src/api/httpClient.ts`

```typescript
// URLs de los microservicios
const BASE_URLS = {
  users: 'http://localhost:8081/api/users',
  books: 'http://localhost:8082/api/books',
  loans: 'http://localhost:8083/api/loans',
  reports: 'http://localhost:8084/api/reports'
};

// Función que agrega el token JWT a cada petición
function getAuthHeaders() {
  const session = JSON.parse(localStorage.getItem('session') || '{}');
  if (session?.token) {
    return { 'Authorization': `Bearer ${session.token}` };
  }
  return {};
}
```

**(CAPTURA DE PANTALLA: Código del httpClient.ts en el IDE)**

---

### 5.3 Flujo de Integración - Ejemplos

#### Ejemplo 1: Login de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUJO DE LOGIN                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario ingresa email y password en el formulario           │
│                          ↓                                       │
│  2. React llama a userService.login(email, password)            │
│                          ↓                                       │
│  3. usersApi.ts hace POST a http://localhost:8081/api/users/login│
│                          ↓                                       │
│  4. Backend valida credenciales y genera JWT                    │
│                          ↓                                       │
│  5. Frontend guarda token en localStorage                       │
│                          ↓                                       │
│  6. Usuario es redirigido al catálogo                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**(CAPTURA DE PANTALLA 1: Formulario de login vacío)**
**(CAPTURA DE PANTALLA 2: Formulario con datos ingresados)**
**(CAPTURA DE PANTALLA 3: Mensaje de éxito y redirección al catálogo)**
**(CAPTURA DE PANTALLA 4: Console del navegador mostrando la respuesta del API)**

---

#### Ejemplo 2: Solicitar Préstamo

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLUJO DE SOLICITUD DE PRÉSTAMO                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario ve un libro en el catálogo                          │
│                          ↓                                       │
│  2. Hace clic en "Solicitar Préstamo"                           │
│                          ↓                                       │
│  3. Frontend envía POST a /api/loans con token JWT              │
│                          ↓                                       │
│  4. Backend crea préstamo con status "PENDIENTE"                │
│                          ↓                                       │
│  5. Admin ve solicitud en su panel                              │
│                          ↓                                       │
│  6. Admin aprueba → PATCH /api/loans/{id}/approve               │
│                          ↓                                       │
│  7. Usuario puede ver préstamo aprobado en "Mis Préstamos"      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**(CAPTURA DE PANTALLA 1: Catálogo con libro disponible)**
**(CAPTURA DE PANTALLA 2: Detalle del libro con botón "Solicitar Préstamo")**
**(CAPTURA DE PANTALLA 3: Mensaje de confirmación "Préstamo solicitado")**
**(CAPTURA DE PANTALLA 4: Panel de admin con préstamo pendiente)**
**(CAPTURA DE PANTALLA 5: Préstamo aprobado en lista)**

---

### 5.4 Verificación de Comunicación REST

#### Prueba con Swagger

1. Acceder a `http://localhost:8081/swagger-ui.html`
2. Ejecutar endpoint POST /api/users/login
3. Copiar el token de la respuesta
4. Usar el token en los demás endpoints protegidos

**(CAPTURA DE PANTALLA: Swagger UI ejecutando endpoint de login)**

#### Prueba con Network Tab del Navegador

1. Abrir DevTools (F12)
2. Ir a la pestaña "Network"
3. Realizar una acción en el frontend
4. Ver la petición y respuesta HTTP

**(CAPTURA DE PANTALLA: DevTools mostrando petición HTTP y respuesta JSON)**

---

## 6. Modelo de Base de Datos

### 6.1 Diagrama de Entidades

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │     BOOKS       │       │     LOANS       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ name            │       │ title           │       │ user_id (FK)    │
│ email (UNIQUE)  │       │ author          │       │ book_id (FK)    │
│ password_hash   │       │ isbn            │       │ loan_date       │
│ role            │       │ category        │       │ due_date        │
│ status          │       │ description     │       │ return_date     │
│ created_at      │       │ cover_url       │       │ status          │
│ updated_at      │       │ total_copies    │       │ created_at      │
└────────┬────────┘       │ available_copies│       └────────┬────────┘
         │                │ status          │                │
         │                │ created_at      │                │
         │                └────────┬────────┘                │
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                          (Relaciones FK)
```

### 6.2 Descripción de Tablas

| Tabla | Descripción | Campos Principales |
|-------|-------------|-------------------|
| **users** | Almacena usuarios del sistema | id, name, email, password_hash, role, status |
| **books** | Catálogo de libros | id, title, author, isbn, category, status |
| **loans** | Registro de préstamos | id, user_id, book_id, loan_date, due_date, status |

**(CAPTURA DE PANTALLA: Diagrama de base de datos en MySQL Workbench o herramienta similar)**

---

## 7. Pruebas y Resultados

### 7.1 Pruebas Unitarias (Frontend)

**Ubicación de tests:** `src/tests-fe/`

| Archivo | Tests | Estado |
|---------|-------|--------|
| user-service.spec.ts | 4 | ✅ Pasando |
| book-service.spec.ts | 10 | ✅ Pasando |
| loan-service.spec.ts | 6 | ✅ Pasando |
| storage-service.spec.ts | 5 | ✅ Pasando |

**Comando para ejecutar tests:**
```bash
npm run test:run
```

**(CAPTURA DE PANTALLA: Terminal mostrando resultados de tests pasando)**

### 7.2 Pruebas de Integración

| Escenario | Resultado | Observaciones |
|-----------|-----------|---------------|
| Login con credenciales válidas | ✅ Exitoso | Token JWT generado correctamente |
| Login con credenciales inválidas | ✅ Exitoso | Muestra mensaje de error |
| Registro de nuevo usuario | ✅ Exitoso | Usuario creado en BD |
| Listar libros del catálogo | ✅ Exitoso | Datos cargados desde backend |
| Solicitar préstamo | ✅ Exitoso | Préstamo creado con estado pendiente |
| Aprobar préstamo (Admin) | ✅ Exitoso | Estado cambia a aprobado |
| Devolver libro | ✅ Exitoso | Libro marcado como devuelto |

**(CAPTURA DE PANTALLA: Tabla de pruebas con resultados en documento/Excel)**

---

## 8. Códigos de Estado HTTP Utilizados

| Código | Significado | Uso en el Sistema |
|--------|-------------|-------------------|
| 200 | OK | Petición exitosa (GET, PUT, PATCH) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 204 | No Content | Eliminación exitosa (DELETE) |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token inválido o no proporcionado |
| 403 | Forbidden | Sin permisos para la acción |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 9. Anexos

### 9.1 Colección Postman

Se incluye archivo `Library_Microservices.postman_collection.json` con todas las peticiones configuradas para pruebas.

**Ubicación:** `postman/Library_Microservices.postman_collection.json`

**(CAPTURA DE PANTALLA: Postman con la colección importada)**

### 9.2 Variables de Entorno

```
# Backend
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=biblioteca
JWT_SECRET=mi-clave-secreta-muy-larga-y-segura

# Frontend
VITE_API_URL=http://localhost:8081
```

---

## 10. Lista de Capturas de Pantalla Requeridas

| # | Descripción | Sección |
|---|-------------|---------|
| 1 | Swagger UI - Endpoint de login | 4.1.1 |
| 2 | Formulario de registro frontend | 4.1.1 |
| 3 | Panel de administración - Lista de usuarios | 4.1.2 |
| 4 | Catálogo de libros (cards) | 4.2.1 |
| 5 | Vista detalle de un libro | 4.2.1 |
| 6 | Barra de búsqueda con resultados | 4.2.1 |
| 7 | Formulario agregar libro (Admin) | 4.2.2 |
| 8 | Panel de préstamos (Admin) | 4.3.1 |
| 9 | Vista "Mis Préstamos" del usuario | 4.3.1 |
| 10 | Botón solicitar préstamo y confirmación | 4.3.2 |
| 11 | Botones Aprobar/Rechazar préstamo | 4.3.2 |
| 12 | Dashboard de estadísticas | 4.4 |
| 13 | Código httpClient.ts en IDE | 5.2 |
| 14 | DevTools Network Tab con petición | 5.4 |
| 15 | Diagrama de base de datos | 6 |
| 16 | Terminal con tests pasando | 7.1 |
| 17 | Postman con colección | 9.1 |

---

**Documento elaborado por:** [Nombre del equipo]  
**Fecha:** 28/11/2024  
**Versión:** 1.0









