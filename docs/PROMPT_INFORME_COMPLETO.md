# 🚀 PROMPT MEGA COMPLETO - INFORME FINAL DEL PROYECTO

## COPIA TODO DESDE AQUÍ Y PEGA EN CHATGPT/CLAUDE:

---

Actúa como un ingeniero de software senior. Genera un **INFORME TÉCNICO COMPLETO** para mi proyecto de evaluación universitaria. El informe debe ser profesional, detallado y listo para entregar.

---

# INFORMACIÓN DEL PROYECTO

## 1. DATOS GENERALES

```
Nombre del Proyecto: Sistema de Gestión de Biblioteca
Tipo: Aplicación Web Full-Stack con Microservicios
Evaluación: Parcial 3 - Desarrollo de Software (40%)
Fecha: Noviembre 2024
Universidad: DuocUC
Asignatura: DSY1104
```

## 2. OBJETIVO DEL PROYECTO

Desarrollar una aplicación web que integre:
- Backend con Spring Boot y base de datos MySQL
- Comunicación REST entre frontend y backend
- Lógica de negocio encapsulada y testeada
- Autenticación JWT con roles (Admin/Usuario)
- Documentación con Swagger

---

# ARQUITECTURA DEL SISTEMA

## 3. STACK TECNOLÓGICO

### Frontend
```
- Framework: React 19
- Lenguaje: TypeScript
- Build Tool: Vite
- Estilos: Bootstrap 5
- Testing: Vitest + React Testing Library
- Puerto: 5173
```

### Backend (Microservicios)
```
- Framework: Spring Boot 3.2.0
- Lenguaje: Java 17
- Seguridad: Spring Security + JWT
- Documentación: SpringDoc OpenAPI (Swagger)
- Base de Datos: MySQL 8.0
```

### Microservicios
```
┌─────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              FRONTEND (React + TypeScript)               │   │
│  │                  http://localhost:5173                   │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│              HTTP/REST + JSON + JWT Token                       │
│                            │                                    │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                    MICROSERVICIOS                        │   │
│  ├──────────────┬──────────────┬──────────────┬────────────┤   │
│  │ MS-USUARIOS  │  MS-LIBROS   │MS-PRÉSTAMOS  │MS-REPORTES │   │
│  │   :8081      │    :8082     │    :8083     │   :8084    │   │
│  └──────┬───────┴──────┬───────┴──────┬───────┴─────┬──────┘   │
│         └──────────────┴──────────────┴─────────────┘          │
│                            │                                    │
│                    ┌───────▼───────┐                           │
│                    │    MySQL      │                           │
│                    │    :3306      │                           │
│                    └───────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

---

# MODELO DE DATOS

## 4. BASE DE DATOS

### Tabla: users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USUARIO', 'ADMINISTRADOR') DEFAULT 'USUARIO',
    status ENUM('ACTIVO', 'BLOQUEADO') DEFAULT 'ACTIVO',
    phone VARCHAR(20),
    profile_image_uri VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: books
```sql
CREATE TABLE books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(50),
    description TEXT,
    cover_url VARCHAR(500),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    status ENUM('DISPONIBLE', 'PRESTADO', 'RESERVADO') DEFAULT 'DISPONIBLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: loans
```sql
CREATE TABLE loans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'DEVUELTO') DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```

### Diagrama Entidad-Relación
```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │   LOANS     │       │   BOOKS     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ PK id       │──┐    │ PK id       │    ┌──│ PK id       │
│ name        │  │    │ FK user_id  │────┘  │ title       │
│ email       │  └───>│ FK book_id  │<──────│ author      │
│ password    │       │ loan_date   │       │ isbn        │
│ role        │       │ due_date    │       │ category    │
│ status      │       │ return_date │       │ copies      │
└─────────────┘       │ status      │       │ status      │
                      └─────────────┘       └─────────────┘

Relaciones:
- users (1) ──── (N) loans : Un usuario puede tener muchos préstamos
- books (1) ──── (N) loans : Un libro puede tener muchos préstamos
```

---

# SEGURIDAD Y AUTENTICACIÓN

## 5. SISTEMA JWT

### Flujo de Autenticación
```
1. Usuario envía: POST /api/users/login
   Body: { "email": "admin@test.com", "password": "admin123" }

2. Backend valida credenciales en MySQL

3. Backend genera JWT:
   Header:  { "alg": "HS256", "typ": "JWT" }
   Payload: { "userId": 1, "email": "admin@test.com", "role": "ADMINISTRADOR", "exp": 1700000000 }
   
4. Backend responde:
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { "id": 1, "name": "Admin", "role": "ADMINISTRADOR" },
     "expiresIn": 86400
   }

5. Frontend guarda token en localStorage

6. Para peticiones protegidas:
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

7. Backend valida token en cada petición
```

### Roles y Permisos
```
┌─────────────────────────────────────────────────────────────────┐
│                      MATRIZ DE PERMISOS                          │
├─────────────────────────────┬─────────────┬─────────────────────┤
│         ACCIÓN              │ USUARIO     │ ADMINISTRADOR       │
├─────────────────────────────┼─────────────┼─────────────────────┤
│ Ver catálogo de libros      │     ✅      │        ✅           │
│ Buscar libros               │     ✅      │        ✅           │
│ Ver detalle de libro        │     ✅      │        ✅           │
│ Solicitar préstamo          │     ✅      │        ✅           │
│ Ver sus préstamos           │     ✅      │        ✅           │
│ Devolver libro              │     ✅      │        ✅           │
├─────────────────────────────┼─────────────┼─────────────────────┤
│ Crear/Editar/Eliminar libro │     ❌      │        ✅           │
│ Ver todos los usuarios      │     ❌      │        ✅           │
│ Editar/Eliminar usuarios    │     ❌      │        ✅           │
│ Aprobar/Rechazar préstamos  │     ❌      │        ✅           │
│ Ver reportes y estadísticas │     ❌      │        ✅           │
│ Bloquear usuarios           │     ❌      │        ✅           │
└─────────────────────────────┴─────────────┴─────────────────────┘
```

---

# DOCUMENTACIÓN DE APIs

## 6. ENDPOINTS COMPLETOS

### MS-USUARIOS (Puerto 8081)
```
┌──────────┬─────────────────────────────┬────────────────────────────────────┬───────────┬─────────┐
│ MÉTODO   │ ENDPOINT                    │ DESCRIPCIÓN                        │ AUTH      │ ROL     │
├──────────┼─────────────────────────────┼────────────────────────────────────┼───────────┼─────────┤
│ POST     │ /api/users/login            │ Iniciar sesión                     │ No        │ Público │
│ POST     │ /api/users/register         │ Registrar usuario                  │ No        │ Público │
│ POST     │ /api/users/validate-token   │ Validar token JWT                  │ No        │ Público │
│ GET      │ /api/users                  │ Listar todos los usuarios          │ Sí        │ Admin   │
│ GET      │ /api/users/{id}             │ Obtener usuario por ID             │ Sí        │ Ambos   │
│ PUT      │ /api/users/{id}             │ Actualizar usuario                 │ Sí        │ Ambos   │
│ DELETE   │ /api/users/{id}             │ Eliminar usuario                   │ Sí        │ Admin   │
│ PATCH    │ /api/users/{id}/block       │ Bloquear/desbloquear               │ Sí        │ Admin   │
└──────────┴─────────────────────────────┴────────────────────────────────────┴───────────┴─────────┘
```

### MS-LIBROS (Puerto 8082)
```
┌──────────┬─────────────────────────────┬────────────────────────────────────┬───────────┬─────────┐
│ MÉTODO   │ ENDPOINT                    │ DESCRIPCIÓN                        │ AUTH      │ ROL     │
├──────────┼─────────────────────────────┼────────────────────────────────────┼───────────┼─────────┤
│ GET      │ /api/books                  │ Listar todos los libros            │ No        │ Público │
│ GET      │ /api/books/{id}             │ Obtener libro por ID               │ No        │ Público │
│ GET      │ /api/books/search?q=texto   │ Buscar por título/autor            │ No        │ Público │
│ GET      │ /api/books/category/{cat}   │ Filtrar por categoría              │ No        │ Público │
│ POST     │ /api/books                  │ Crear nuevo libro                  │ Sí        │ Admin   │
│ PUT      │ /api/books/{id}             │ Actualizar libro                   │ Sí        │ Admin   │
│ DELETE   │ /api/books/{id}             │ Eliminar libro                     │ Sí        │ Admin   │
└──────────┴─────────────────────────────┴────────────────────────────────────┴───────────┴─────────┘
```

### MS-PRÉSTAMOS (Puerto 8083)
```
┌──────────┬─────────────────────────────┬────────────────────────────────────┬───────────┬─────────┐
│ MÉTODO   │ ENDPOINT                    │ DESCRIPCIÓN                        │ AUTH      │ ROL     │
├──────────┼─────────────────────────────┼────────────────────────────────────┼───────────┼─────────┤
│ GET      │ /api/loans                  │ Listar todos los préstamos         │ Sí        │ Admin   │
│ GET      │ /api/loans/{id}             │ Obtener préstamo por ID            │ Sí        │ Ambos   │
│ GET      │ /api/loans/user/{userId}    │ Préstamos de un usuario            │ Sí        │ Ambos   │
│ GET      │ /api/loans/pending          │ Préstamos pendientes               │ Sí        │ Admin   │
│ POST     │ /api/loans                  │ Solicitar préstamo                 │ Sí        │ Ambos   │
│ PATCH    │ /api/loans/{id}/approve     │ Aprobar préstamo                   │ Sí        │ Admin   │
│ PATCH    │ /api/loans/{id}/reject      │ Rechazar préstamo                  │ Sí        │ Admin   │
│ PATCH    │ /api/loans/{id}/return      │ Devolver libro                     │ Sí        │ Ambos   │
└──────────┴─────────────────────────────┴────────────────────────────────────┴───────────┴─────────┘
```

### MS-REPORTES (Puerto 8084)
```
┌──────────┬─────────────────────────────┬────────────────────────────────────┬───────────┬─────────┐
│ MÉTODO   │ ENDPOINT                    │ DESCRIPCIÓN                        │ AUTH      │ ROL     │
├──────────┼─────────────────────────────┼────────────────────────────────────┼───────────┼─────────┤
│ GET      │ /api/reports/dashboard      │ Estadísticas generales             │ Sí        │ Admin   │
│ GET      │ /api/reports/loans          │ Reporte de préstamos               │ Sí        │ Admin   │
│ GET      │ /api/reports/books/popular  │ Libros más solicitados             │ Sí        │ Admin   │
│ GET      │ /api/reports/users/active   │ Usuarios más activos               │ Sí        │ Admin   │
│ GET      │ /api/reports/overdue        │ Préstamos vencidos                 │ Sí        │ Admin   │
└──────────┴─────────────────────────────┴────────────────────────────────────┴───────────┴─────────┘
```

### Ejemplos de Request/Response

#### Login
```json
// REQUEST
POST http://localhost:8081/api/users/login
Content-Type: application/json

{
  "email": "admin@biblioteca.com",
  "password": "admin123"
}

// RESPONSE 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYmlibGlvdGVjYS5jb20iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsImV4cCI6MTcwMDAwMDAwMH0.abc123",
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

#### Crear Libro
```json
// REQUEST
POST http://localhost:8082/api/books
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "category": "Programación",
  "description": "Guía para escribir código limpio",
  "totalCopies": 5
}

// RESPONSE 201 Created
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "category": "Programación",
  "status": "DISPONIBLE",
  "totalCopies": 5,
  "availableCopies": 5
}
```

#### Solicitar Préstamo
```json
// REQUEST
POST http://localhost:8083/api/loans
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "userId": 2,
  "bookId": 1
}

// RESPONSE 201 Created
{
  "id": 1,
  "userId": 2,
  "bookId": 1,
  "bookTitle": "Clean Code",
  "loanDate": "2024-11-28",
  "dueDate": "2024-12-12",
  "status": "PENDIENTE"
}
```

---

# INTEGRACIÓN FRONTEND-BACKEND

## 7. ESTRUCTURA DEL FRONTEND

```
src/
├── api/                          # Conexión con backend
│   ├── httpClient.ts             # Cliente HTTP base + JWT
│   ├── usersApi.ts               # Endpoints de usuarios
│   ├── booksApi.ts               # Endpoints de libros
│   └── loansApi.ts               # Endpoints de préstamos
│
├── services/                     # Lógica de negocio
│   ├── user.service.ts           # Servicio de usuarios
│   ├── book.service.ts           # Servicio de libros
│   ├── loan.service.ts           # Servicio de préstamos
│   └── storage.service.ts        # Manejo de localStorage
│
├── hooks/                        # React Hooks
│   └── useUser.ts                # Hook de autenticación
│
├── ui/                           # Componentes UI
│   ├── public/                   # Páginas públicas
│   │   ├── Catalog.tsx           # Catálogo de libros
│   │   ├── BookDetail.tsx        # Detalle de libro
│   │   └── MyLoans.tsx           # Mis préstamos
│   ├── admin/                    # Páginas de admin
│   │   ├── BooksAdmin.tsx        # Gestión de libros
│   │   ├── UsersAdmin.tsx        # Gestión de usuarios
│   │   └── LoansAdmin.tsx        # Gestión de préstamos
│   └── auth/                     # Autenticación
│       ├── Login.tsx             # Página de login
│       └── Register.tsx          # Página de registro
│
├── domain/                       # Tipos/Interfaces
│   ├── user.ts                   # Tipos de usuario
│   ├── book.ts                   # Tipos de libro
│   └── loan.ts                   # Tipos de préstamo
│
└── tests-fe/                     # Tests unitarios
    ├── user-service.spec.ts      # 4 tests
    ├── book-service.spec.ts      # 10 tests
    ├── loan-service.spec.ts      # 6 tests
    └── storage-service.spec.ts   # 5 tests
```

## 8. CÓDIGO DE CONEXIÓN

### httpClient.ts
```typescript
const BASE_URLS = {
  users: 'http://localhost:8081/api/users',
  books: 'http://localhost:8082/api/books',
  loans: 'http://localhost:8083/api/loans',
  reports: 'http://localhost:8084/api/reports'
};

function getAuthHeaders() {
  const session = JSON.parse(localStorage.getItem('session') || '{}');
  return session?.token 
    ? { 'Authorization': `Bearer ${session.token}` } 
    : {};
}

export const httpClient = {
  async get(url: string) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  },
  
  async post(url: string, data: object) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  },
  
  urls: BASE_URLS
};
```

---

# PRUEBAS Y TESTING

## 9. TESTS UNITARIOS

### Resumen de Tests
```
┌────────────────────────────────┬─────────┬──────────┐
│ ARCHIVO                        │ TESTS   │ ESTADO   │
├────────────────────────────────┼─────────┼──────────┤
│ user-service.spec.ts           │ 4       │ ✅ PASS  │
│ book-service.spec.ts           │ 10      │ ✅ PASS  │
│ loan-service.spec.ts           │ 6       │ ✅ PASS  │
│ storage-service.spec.ts        │ 5       │ ✅ PASS  │
│ book-card.spec.tsx             │ 7       │ ✅ PASS  │
│ loan-form.spec.tsx             │ 5       │ ✅ PASS  │
├────────────────────────────────┼─────────┼──────────┤
│ TOTAL                          │ 37+     │ ✅ PASS  │
└────────────────────────────────┴─────────┴──────────┘
```

### Uso de Mocks
```typescript
// Los tests usan MOCKS para:
// 1. Simular respuestas del backend sin servidor real
// 2. Simular localStorage en entorno Node.js
// 3. Aislar el código bajo prueba

vi.mock('../api/usersApi', () => ({
  usersApi: {
    login: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    register: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));
```

### Comando para ejecutar tests
```bash
npm run test:run
# Resultado esperado: Tests: 37+ passed
```

---

# DOCUMENTACIÓN SWAGGER

## 10. URLs DE SWAGGER

```
User Management:  http://localhost:8081/swagger-ui.html
Book Catalog:     http://localhost:8082/swagger-ui.html
Loan Management:  http://localhost:8083/swagger-ui.html
Reports Service:  http://localhost:8084/swagger-ui.html
```

---

# CÓDIGOS HTTP

## 11. TABLA DE CÓDIGOS

```
┌────────┬─────────────────────────┬──────────────────────────────────────┐
│ CÓDIGO │ SIGNIFICADO             │ USO EN EL SISTEMA                    │
├────────┼─────────────────────────┼──────────────────────────────────────┤
│ 200    │ OK                      │ GET, PUT, PATCH exitosos             │
│ 201    │ Created                 │ POST exitoso (recurso creado)        │
│ 204    │ No Content              │ DELETE exitoso                       │
│ 400    │ Bad Request             │ Datos de entrada inválidos           │
│ 401    │ Unauthorized            │ Token no enviado o inválido          │
│ 403    │ Forbidden               │ Sin permisos para la acción          │
│ 404    │ Not Found               │ Recurso no encontrado                │
│ 409    │ Conflict                │ Conflicto (email duplicado, etc)     │
│ 500    │ Internal Server Error   │ Error del servidor                   │
└────────┴─────────────────────────┴──────────────────────────────────────┘
```

---

# REPOSITORIOS

## 12. ENLACES GITHUB

```
Frontend:  https://github.com/matyduocuc/full-LIBRAY.git
Backend:   [URL del repositorio backend]
```

---

# INSTRUCCIONES PARA EL INFORME

Genera un **INFORME TÉCNICO PROFESIONAL** con las siguientes secciones:

1. **PORTADA**
   - Título del proyecto
   - Asignatura y código
   - Integrantes del equipo
   - Fecha
   - Logo de la universidad

2. **ÍNDICE** automático

3. **RESUMEN EJECUTIVO** (1 página)
   - Descripción breve del proyecto
   - Objetivos logrados
   - Tecnologías principales

4. **INTRODUCCIÓN**
   - Contexto del proyecto
   - Problemática que resuelve
   - Alcance

5. **ARQUITECTURA DEL SISTEMA**
   - Diagrama de arquitectura
   - Stack tecnológico
   - Descripción de cada microservicio

6. **MODELO DE DATOS**
   - Diagrama Entidad-Relación
   - Descripción de tablas
   - Relaciones

7. **DOCUMENTACIÓN DE APIs**
   - Tabla de TODOS los endpoints
   - Ejemplos de Request/Response
   - Códigos de error

8. **SEGURIDAD**
   - Sistema JWT explicado
   - Roles y permisos
   - Flujo de autenticación

9. **INTEGRACIÓN FRONTEND-BACKEND**
   - Estructura del código
   - Archivos de conexión
   - Manejo de errores

10. **PRUEBAS REALIZADAS**
    - Tests unitarios
    - Resultados
    - Uso de mocks

11. **SWAGGER**
    - URLs de documentación
    - **(INCLUIR CAPTURAS DE PANTALLA)**

12. **CONCLUSIONES**
    - Objetivos cumplidos
    - Lecciones aprendidas
    - Mejoras futuras

13. **ANEXOS**
    - Enlaces a repositorios
    - Manual de instalación
    - Credenciales de prueba:
      - Admin: admin@biblioteca.com / admin123
      - User: usuario@biblioteca.com / user123

---

## NOTAS IMPORTANTES

- Usa formato Markdown profesional
- Incluye diagramas ASCII donde corresponda
- Marca con **(CAPTURA DE PANTALLA: descripción)** donde debe ir una imagen
- El documento debe tener al menos 15-20 páginas
- Incluye tabla de contenidos
- Usa numeración de secciones

---

# FIN DEL PROMPT

---









