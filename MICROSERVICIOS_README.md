# 🚀 MICROSERVICIOS - BIBLIOTECA DIGITAL

## 📋 Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│                      http://localhost:5173                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ MS-USUARIOS   │    │  MS-LIBROS    │    │ MS-PRESTAMOS  │
│  :8081        │    │   :8082       │    │   :8083       │
│               │    │               │    │               │
│ • Auth/Login  │    │ • CRUD Libros │    │ • Préstamos   │
│ • JWT Token   │    │ • Categorías  │    │ • Renovar     │
│ • Usuarios    │    │ • Autores     │    │ • Devolver    │
└───────────────┘    └───────────────┘    └───────────────┘
                                                │
                          ┌─────────────────────┘
                          ▼
                 ┌───────────────┐
                 │ MS-INFORMES   │
                 │   :8085       │
                 │               │
                 │ • Reportes    │
                 │ • Estadísticas│
                 └───────────────┘
```

## 🔧 Requisitos

- **Java 17+** (JDK)
- **Maven 3.8+**

## 📦 Estructura de Carpetas

```
library-up-main/
├── ms-usuarios/     ← Puerto 8081
├── ms-libros/       ← Puerto 8082
├── ms-prestamos/    ← Puerto 8083
├── ms-informes/     ← Puerto 8085
└── src/             ← Frontend React
```

## 🚀 Cómo Ejecutar

### Opción 1: Ejecutar cada microservicio por separado

Abre 4 terminales y ejecuta en cada una:

```bash
# Terminal 1 - Usuarios (8081)
cd ms-usuarios
mvn spring-boot:run

# Terminal 2 - Libros (8082)
cd ms-libros
mvn spring-boot:run

# Terminal 3 - Préstamos (8083)
cd ms-prestamos
mvn spring-boot:run

# Terminal 4 - Informes (8085)
cd ms-informes
mvn spring-boot:run
```

### Opción 2: Usar el script (Windows)

```powershell
.\run-microservices.bat
```

## 🔗 URLs Disponibles

| Microservicio | Puerto | Swagger UI | API Base |
|---------------|--------|------------|----------|
| Usuarios | 8081 | http://localhost:8081/swagger-ui.html | /api/auth, /api/usuarios |
| Libros | 8082 | http://localhost:8082/swagger-ui.html | /api/libros |
| Préstamos | 8083 | http://localhost:8083/swagger-ui.html | /api/v1/prestamos |
| Informes | 8085 | http://localhost:8085/swagger-ui.html | /api/informes |

## 🔐 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@biblioteca.com | admin123 |
| Usuario | usuario@biblioteca.com | user123 |

## 📚 Endpoints Principales

### MS-USUARIOS (8081)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/usuarios` - Listar usuarios (Admin)
- `GET /api/usuarios/{id}` - Obtener usuario

### MS-LIBROS (8082)
- `GET /api/libros` - Listar libros
- `GET /api/libros/{id}` - Obtener libro
- `GET /api/libros/disponibles` - Libros disponibles
- `POST /api/libros/buscar` - Buscar libros
- `POST /api/libros` - Crear libro (Admin)
- `PUT /api/libros/{id}` - Actualizar libro (Admin)
- `DELETE /api/libros/{id}` - Eliminar libro (Admin)

### MS-PRESTAMOS (8083)
- `GET /api/v1/prestamos` - Listar préstamos
- `GET /api/v1/prestamos/usuario/{id}` - Préstamos por usuario
- `POST /api/v1/prestamos` - Crear préstamo
- `POST /api/v1/prestamos/{id}/renovar` - Renovar
- `POST /api/v1/prestamos/{id}/devolver` - Devolver

### MS-INFORMES (8085)
- `GET /api/informes/prestamos/resumen` - Resumen préstamos
- `GET /api/informes/usuarios/{id}/resumen` - Resumen usuario
- `GET /api/informes/multas/resumen` - Resumen multas

## 🧪 Probar con cURL

```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@biblioteca.com","password":"admin123"}'

# Listar libros
curl http://localhost:8082/api/libros

# Ver préstamos
curl http://localhost:8083/api/v1/prestamos
```

## ✅ Verificación de Requisitos DSY1104

| Requisito | Estado | Ubicación |
|-----------|--------|-----------|
| Backend con BD | ✅ | Cada MS tiene H2 |
| API REST CRUD | ✅ | Controllers |
| Swagger | ✅ | /swagger-ui.html |
| JWT Auth | ✅ | ms-usuarios |
| Roles | ✅ | ADMIN/USER |
















