# Manual de Usuario

## Sistema de Gestión de Biblioteca

---

**Versión del Documento:** 1.0  
**Fecha de Creación:** 28/11/2024  
**Elaborado por:** [Nombre del equipo]

---

## Formato de Documentación de Imágenes

> **IMPORTANTE:** Cada imagen añadida debe documentarse así:
> - **Número:** Figura X
> - **Título:** Descripción breve
> - **Imagen:** (insertar captura)
> - **Nota:** Explicación de lo que muestra
> - **Formato:** Borde 1px, color negro

---

# ÍNDICE

1. [Introducción](#1-introducción)
2. [Requisitos del Sistema](#2-requisitos-del-sistema)
3. [Acceso al Sistema](#3-acceso-al-sistema)
4. [Módulo de Autenticación](#4-módulo-de-autenticación)
5. [Catálogo de Libros](#5-catálogo-de-libros)
6. [Gestión de Préstamos](#6-gestión-de-préstamos)
7. [Panel de Administración](#7-panel-de-administración)
8. [Preguntas Frecuentes](#8-preguntas-frecuentes)
9. [Solución de Problemas](#9-solución-de-problemas)
10. [Contacto y Soporte](#10-contacto-y-soporte)

---

# 1. Introducción

## 1.1 Propósito del Documento

Este manual tiene como objetivo guiar a los usuarios en el uso del **Sistema de Gestión de Biblioteca**, proporcionando instrucciones detalladas para realizar todas las operaciones disponibles según el rol del usuario.

**Está destinado a:**
- **Usuarios regulares:** Personas que desean consultar el catálogo y solicitar préstamos de libros.
- **Administradores:** Personal de la biblioteca encargado de gestionar libros, usuarios y préstamos.

## 1.2 Descripción del Sistema

El Sistema de Gestión de Biblioteca es una aplicación web que permite:

| Funcionalidad | Descripción |
|---------------|-------------|
| **Catálogo de libros** | Consultar, buscar y filtrar libros disponibles |
| **Préstamos** | Solicitar, aprobar y devolver préstamos de libros |
| **Gestión de usuarios** | Registrar, editar y administrar cuentas de usuario |
| **Reportes** | Generar estadísticas de uso del sistema |

## 1.3 Cómo Usar Este Manual

Este manual está organizado por módulos del sistema. Para encontrar la información que necesita:

1. **Consulte el índice** para ubicar la sección deseada
2. **Siga las instrucciones paso a paso** acompañadas de imágenes
3. **Revise las notas y advertencias** marcadas con iconos especiales:
   - 📌 **Nota:** Información adicional importante
   - ⚠️ **Advertencia:** Acciones que requieren precaución
   - ✅ **Consejo:** Recomendaciones para mejor uso

---

# 2. Requisitos del Sistema

## 2.1 Requisitos de Hardware

| Componente | Requisito Mínimo |
|------------|------------------|
| Procesador | Intel Core i3 o equivalente |
| Memoria RAM | 4 GB |
| Almacenamiento | 100 MB disponibles |
| Conexión | Internet estable |

## 2.2 Requisitos de Software

| Software | Versión |
|----------|---------|
| Navegador Web | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| JavaScript | Habilitado en el navegador |

## 2.3 Navegadores Compatibles

```
┌─────────────────────────────────────────────────────────────────┐
│                  NAVEGADORES COMPATIBLES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Google Chrome (Recomendado)                                 │
│  ✅ Mozilla Firefox                                             │
│  ✅ Microsoft Edge                                              │
│  ✅ Safari                                                      │
│  ❌ Internet Explorer (No compatible)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 3. Acceso al Sistema

## 3.1 URL de Acceso

Para acceder al sistema, abra su navegador e ingrese la siguiente dirección:

```
http://localhost:5173
```

O en producción:
```
https://biblioteca.ejemplo.com
```

---

**Figura 1: Página de Inicio del Sistema**

**(INSERTAR CAPTURA DE PANTALLA: Página principal del sistema mostrando el catálogo de libros)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 1 |
| Título | Página de Inicio del Sistema |
| Nota | Vista principal que muestra el catálogo de libros disponibles. El usuario puede navegar sin iniciar sesión para ver los libros. |

---

## 3.2 Navegación Principal

El sistema cuenta con una barra de navegación superior con las siguientes opciones:

| Opción | Descripción | Acceso |
|--------|-------------|--------|
| **Inicio** | Página principal con catálogo | Todos |
| **Catálogo** | Lista completa de libros | Todos |
| **Mis Préstamos** | Préstamos del usuario actual | Usuarios registrados |
| **Administración** | Panel de gestión | Solo administradores |
| **Iniciar Sesión** | Acceso al sistema | No autenticados |
| **Mi Perfil** | Datos del usuario | Usuarios autenticados |

---

**Figura 2: Barra de Navegación**

**(INSERTAR CAPTURA DE PANTALLA: Barra de navegación superior mostrando las opciones del menú)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 2 |
| Título | Barra de Navegación Principal |
| Nota | Menú superior que permite acceder a todas las secciones del sistema. Las opciones visibles varían según el rol del usuario. |

---

# 4. Módulo de Autenticación

## 4.1 Registro de Nuevo Usuario

Para crear una cuenta nueva, siga estos pasos:

### Paso 1: Acceder al formulario de registro

1. Haga clic en **"Registrarse"** en la barra de navegación
2. Se mostrará el formulario de registro

---

**Figura 3: Formulario de Registro**

**(INSERTAR CAPTURA DE PANTALLA: Formulario de registro con campos vacíos)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 3 |
| Título | Formulario de Registro de Usuario |
| Nota | Formulario que solicita nombre completo, correo electrónico y contraseña para crear una nueva cuenta. |

---

### Paso 2: Completar los datos

Complete los siguientes campos:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Nombre completo** | Su nombre y apellido | Juan Pérez |
| **Correo electrónico** | Email válido (será su usuario) | juan@ejemplo.com |
| **Contraseña** | Mínimo 6 caracteres | ******** |
| **Confirmar contraseña** | Repetir contraseña | ******** |

### Paso 3: Enviar el formulario

1. Verifique que todos los datos son correctos
2. Haga clic en el botón **"Registrarse"**
3. Si el registro es exitoso, será redirigido al catálogo

---

**Figura 4: Registro Exitoso**

**(INSERTAR CAPTURA DE PANTALLA: Mensaje de confirmación de registro exitoso)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 4 |
| Título | Confirmación de Registro Exitoso |
| Nota | Mensaje que confirma que la cuenta ha sido creada correctamente y el usuario puede comenzar a usar el sistema. |

---

📌 **Nota:** El correo electrónico debe ser único. Si ya existe una cuenta con ese email, recibirá un mensaje de error.

---

## 4.2 Inicio de Sesión

Para acceder a su cuenta existente:

### Paso 1: Acceder al formulario de login

1. Haga clic en **"Iniciar Sesión"** en la barra de navegación

---

**Figura 5: Formulario de Inicio de Sesión**

**(INSERTAR CAPTURA DE PANTALLA: Formulario de login con campos de email y contraseña)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 5 |
| Título | Formulario de Inicio de Sesión |
| Nota | Formulario para ingresar credenciales. Solicita correo electrónico y contraseña. |

---

### Paso 2: Ingresar credenciales

| Campo | Descripción |
|-------|-------------|
| **Correo electrónico** | El email registrado |
| **Contraseña** | Su contraseña |

### Paso 3: Acceder al sistema

1. Haga clic en **"Iniciar Sesión"**
2. Si las credenciales son correctas, será redirigido al catálogo
3. Verá su nombre en la barra de navegación

---

**Figura 6: Usuario Autenticado**

**(INSERTAR CAPTURA DE PANTALLA: Barra de navegación mostrando el nombre del usuario logueado)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 6 |
| Título | Usuario Autenticado en el Sistema |
| Nota | La barra de navegación muestra el nombre del usuario y las opciones disponibles según su rol. |

---

⚠️ **Advertencia:** Si ingresa credenciales incorrectas 3 veces consecutivas, su cuenta podría ser bloqueada temporalmente.

---

## 4.3 Cerrar Sesión

Para salir del sistema de forma segura:

1. Haga clic en su nombre en la barra de navegación
2. Seleccione **"Cerrar Sesión"**
3. Será redirigido a la página de inicio

---

## 4.4 Credenciales de Prueba

Para fines de demostración, puede usar las siguientes cuentas:

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | admin@biblioteca.com | admin123 |
| **Usuario** | usuario@biblioteca.com | user123 |

---

# 5. Catálogo de Libros

## 5.1 Ver Catálogo Completo

Al acceder al sistema, se muestra el catálogo completo de libros disponibles.

---

**Figura 7: Catálogo de Libros**

**(INSERTAR CAPTURA DE PANTALLA: Vista del catálogo mostrando las tarjetas de libros)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 7 |
| Título | Catálogo de Libros Disponibles |
| Nota | Vista principal del catálogo mostrando los libros en formato de tarjetas con título, autor, categoría y estado de disponibilidad. |

---

### Información mostrada por libro:

| Elemento | Descripción |
|----------|-------------|
| **Portada** | Imagen del libro |
| **Título** | Nombre del libro |
| **Autor** | Nombre del autor |
| **Categoría** | Género o tema del libro |
| **Estado** | Disponible / Prestado / Reservado |
| **Botón** | "Solicitar Préstamo" o "Ver Detalles" |

---

## 5.2 Buscar Libros

Para encontrar un libro específico:

### Paso 1: Usar la barra de búsqueda

1. Ubique la barra de búsqueda en la parte superior del catálogo
2. Escriba el título o autor del libro
3. Los resultados se filtran automáticamente

---

**Figura 8: Búsqueda de Libros**

**(INSERTAR CAPTURA DE PANTALLA: Barra de búsqueda con texto y resultados filtrados)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 8 |
| Título | Búsqueda de Libros por Título o Autor |
| Nota | La búsqueda es instantánea y muestra solo los libros que coinciden con el texto ingresado. |

---

## 5.3 Filtrar por Categoría

Para ver libros de una categoría específica:

1. Localice el selector de categorías
2. Seleccione la categoría deseada
3. El catálogo mostrará solo libros de esa categoría

---

**Figura 9: Filtro por Categoría**

**(INSERTAR CAPTURA DE PANTALLA: Selector de categorías desplegado con opciones)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 9 |
| Título | Filtrado de Libros por Categoría |
| Nota | Permite filtrar el catálogo por categorías como: Programación, Historia, Ciencia, Literatura, etc. |

---

### Categorías disponibles:

- 📚 Programación
- 📖 Literatura
- 🔬 Ciencia
- 📜 Historia
- 💼 Negocios
- 🎨 Arte
- 🏥 Salud

---

## 5.4 Ver Detalle de un Libro

Para ver información completa de un libro:

1. Haga clic en la tarjeta del libro o en **"Ver Detalles"**
2. Se abrirá la página de detalle del libro

---

**Figura 10: Detalle de Libro**

**(INSERTAR CAPTURA DE PANTALLA: Página de detalle de un libro con toda la información)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 10 |
| Título | Vista de Detalle de Libro |
| Nota | Muestra información completa: portada grande, título, autor, ISBN, descripción, número de copias disponibles y botón para solicitar préstamo. |

---

### Información en la vista de detalle:

| Campo | Descripción |
|-------|-------------|
| **Portada** | Imagen en tamaño grande |
| **Título** | Nombre completo del libro |
| **Autor** | Nombre del escritor |
| **ISBN** | Código único del libro |
| **Categoría** | Clasificación temática |
| **Descripción** | Sinopsis o resumen |
| **Copias totales** | Cantidad de ejemplares |
| **Copias disponibles** | Ejemplares no prestados |
| **Estado** | Disponibilidad actual |

---

# 6. Gestión de Préstamos

## 6.1 Solicitar un Préstamo

Para solicitar el préstamo de un libro:

### Requisitos previos:
- ✅ Debe tener una cuenta registrada
- ✅ Debe haber iniciado sesión
- ✅ El libro debe estar disponible

### Paso 1: Seleccionar el libro

1. Navegue al catálogo
2. Encuentre el libro deseado
3. Verifique que el estado sea **"Disponible"**

### Paso 2: Solicitar el préstamo

1. Haga clic en **"Solicitar Préstamo"**
2. Confirme la solicitud en el diálogo

---

**Figura 11: Solicitud de Préstamo**

**(INSERTAR CAPTURA DE PANTALLA: Diálogo de confirmación para solicitar préstamo)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 11 |
| Título | Confirmación de Solicitud de Préstamo |
| Nota | Diálogo que muestra los detalles del libro y solicita confirmación antes de crear la solicitud de préstamo. |

---

### Paso 3: Esperar aprobación

1. La solicitud queda en estado **"Pendiente"**
2. Un administrador debe aprobar el préstamo
3. Recibirá notificación cuando sea aprobado

---

**Figura 12: Préstamo Pendiente**

**(INSERTAR CAPTURA DE PANTALLA: Mensaje mostrando que el préstamo está pendiente de aprobación)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 12 |
| Título | Préstamo Pendiente de Aprobación |
| Nota | Mensaje de confirmación indicando que la solicitud fue enviada y está pendiente de revisión por un administrador. |

---

📌 **Nota:** El préstamo tiene una duración de 14 días a partir de la aprobación.

---

## 6.2 Ver Mis Préstamos

Para consultar sus préstamos actuales e históricos:

1. Inicie sesión en el sistema
2. Haga clic en **"Mis Préstamos"** en la barra de navegación

---

**Figura 13: Lista de Mis Préstamos**

**(INSERTAR CAPTURA DE PANTALLA: Página "Mis Préstamos" mostrando lista de préstamos)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 13 |
| Título | Vista de Mis Préstamos |
| Nota | Lista de todos los préstamos del usuario mostrando: libro, fecha de préstamo, fecha de devolución y estado actual. |

---

### Estados de préstamo:

| Estado | Color | Significado |
|--------|-------|-------------|
| 🟡 **Pendiente** | Amarillo | Esperando aprobación del administrador |
| 🟢 **Aprobado** | Verde | Préstamo activo, libro en su poder |
| 🔴 **Rechazado** | Rojo | Solicitud denegada |
| 🔵 **Devuelto** | Azul | Libro ya devuelto |

---

## 6.3 Devolver un Libro

Para devolver un libro prestado:

### Paso 1: Ir a Mis Préstamos

1. Acceda a **"Mis Préstamos"**
2. Localice el préstamo con estado **"Aprobado"**

### Paso 2: Registrar devolución

1. Haga clic en **"Devolver"**
2. Confirme la devolución

---

**Figura 14: Devolución de Libro**

**(INSERTAR CAPTURA DE PANTALLA: Botón de devolver y confirmación de devolución)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 14 |
| Título | Proceso de Devolución de Libro |
| Nota | Interfaz para registrar la devolución de un libro. El estado cambia a "Devuelto" y el libro vuelve a estar disponible. |

---

⚠️ **Advertencia:** Devuelva los libros antes de la fecha de vencimiento para evitar multas.

---

# 7. Panel de Administración

> **Acceso:** Solo usuarios con rol de **Administrador**

## 7.1 Acceso al Panel de Admin

1. Inicie sesión con cuenta de administrador
2. Haga clic en **"Administración"** en la barra de navegación

---

**Figura 15: Panel de Administración**

**(INSERTAR CAPTURA DE PANTALLA: Vista principal del panel de administración)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 15 |
| Título | Panel Principal de Administración |
| Nota | Dashboard del administrador con acceso a gestión de libros, usuarios, préstamos y reportes. |

---

## 7.2 Gestión de Libros

### 7.2.1 Agregar Nuevo Libro

1. En el panel de admin, seleccione **"Libros"**
2. Haga clic en **"Agregar Libro"**
3. Complete el formulario

---

**Figura 16: Formulario Agregar Libro**

**(INSERTAR CAPTURA DE PANTALLA: Formulario para crear nuevo libro)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 16 |
| Título | Formulario de Nuevo Libro |
| Nota | Formulario para agregar libros al catálogo con campos: título, autor, ISBN, categoría, descripción, portada y cantidad de copias. |

---

### Campos del formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| Título | ✅ Sí | Nombre del libro |
| Autor | ✅ Sí | Nombre del escritor |
| ISBN | ❌ No | Código único |
| Categoría | ✅ Sí | Clasificación |
| Descripción | ❌ No | Sinopsis |
| URL Portada | ❌ No | Imagen del libro |
| Copias | ✅ Sí | Cantidad de ejemplares |

---

### 7.2.2 Editar Libro

1. En la lista de libros, haga clic en **"Editar"** (ícono de lápiz)
2. Modifique los campos necesarios
3. Haga clic en **"Guardar Cambios"**

---

**Figura 17: Edición de Libro**

**(INSERTAR CAPTURA DE PANTALLA: Modal o formulario de edición de libro)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 17 |
| Título | Edición de Información de Libro |
| Nota | Formulario precargado con los datos actuales del libro para su modificación. |

---

### 7.2.3 Eliminar Libro

1. En la lista de libros, haga clic en **"Eliminar"** (ícono de papelera)
2. Confirme la eliminación en el diálogo

---

⚠️ **Advertencia:** No se puede eliminar un libro que tiene préstamos activos.

---

## 7.3 Gestión de Usuarios

### 7.3.1 Ver Lista de Usuarios

1. En el panel de admin, seleccione **"Usuarios"**
2. Se mostrará la lista de todos los usuarios registrados

---

**Figura 18: Lista de Usuarios**

**(INSERTAR CAPTURA DE PANTALLA: Tabla con lista de usuarios del sistema)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 18 |
| Título | Gestión de Usuarios del Sistema |
| Nota | Lista de usuarios mostrando: nombre, email, rol, estado y acciones disponibles (editar, bloquear, eliminar). |

---

### 7.3.2 Bloquear/Desbloquear Usuario

1. Localice el usuario en la lista
2. Haga clic en **"Bloquear"** o **"Desbloquear"**
3. El estado cambiará inmediatamente

---

## 7.4 Gestión de Préstamos

### 7.4.1 Ver Préstamos Pendientes

1. En el panel de admin, seleccione **"Préstamos"**
2. Filtre por estado **"Pendiente"**

---

**Figura 19: Préstamos Pendientes**

**(INSERTAR CAPTURA DE PANTALLA: Lista de préstamos pendientes de aprobación)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 19 |
| Título | Préstamos Pendientes de Aprobación |
| Nota | Lista de solicitudes de préstamo que requieren revisión del administrador con botones para aprobar o rechazar. |

---

### 7.4.2 Aprobar Préstamo

1. Localice el préstamo pendiente
2. Haga clic en **"Aprobar"** (botón verde)
3. El préstamo cambia a estado **"Aprobado"**

---

**Figura 20: Aprobación de Préstamo**

**(INSERTAR CAPTURA DE PANTALLA: Botón de aprobar y confirmación)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 20 |
| Título | Aprobación de Solicitud de Préstamo |
| Nota | Al aprobar, el libro se marca como prestado y el usuario puede retirarlo. |

---

### 7.4.3 Rechazar Préstamo

1. Localice el préstamo pendiente
2. Haga clic en **"Rechazar"** (botón rojo)
3. El préstamo cambia a estado **"Rechazado"**

---

## 7.5 Reportes y Estadísticas

### 7.5.1 Dashboard

1. En el panel de admin, seleccione **"Reportes"** o **"Dashboard"**
2. Visualice las estadísticas generales

---

**Figura 21: Dashboard de Estadísticas**

**(INSERTAR CAPTURA DE PANTALLA: Dashboard con gráficos y estadísticas)**

| Campo | Descripción |
|-------|-------------|
| Número | Figura 21 |
| Título | Dashboard de Estadísticas del Sistema |
| Nota | Panel con métricas: total de usuarios, libros, préstamos activos, préstamos pendientes y libros más solicitados. |

---

### Métricas disponibles:

| Métrica | Descripción |
|---------|-------------|
| **Total Usuarios** | Cantidad de usuarios registrados |
| **Total Libros** | Cantidad de libros en el catálogo |
| **Préstamos Activos** | Préstamos en curso |
| **Préstamos Pendientes** | Solicitudes por aprobar |
| **Libros Populares** | Top 10 más solicitados |

---

# 8. Preguntas Frecuentes

## 8.1 Sobre Cuentas

**P: ¿Cómo recupero mi contraseña?**
R: Contacte al administrador del sistema para restablecer su contraseña.

**P: ¿Puedo cambiar mi correo electrónico?**
R: Sí, desde su perfil puede actualizar su información personal.

**P: ¿Por qué no puedo iniciar sesión?**
R: Verifique que su correo y contraseña sean correctos. Si el problema persiste, su cuenta podría estar bloqueada.

## 8.2 Sobre Préstamos

**P: ¿Cuántos libros puedo tener prestados a la vez?**
R: El límite es de 3 libros simultáneos por usuario.

**P: ¿Cuánto tiempo dura un préstamo?**
R: Los préstamos tienen una duración de 14 días.

**P: ¿Qué pasa si no devuelvo a tiempo?**
R: Se generará una multa y su cuenta podría ser suspendida hasta la devolución.

**P: ¿Por qué mi solicitud fue rechazada?**
R: Posibles razones: libro no disponible, límite de préstamos alcanzado, o cuenta con multas pendientes.

## 8.3 Sobre el Sistema

**P: ¿En qué navegadores funciona?**
R: Chrome, Firefox, Edge y Safari en sus versiones recientes.

**P: ¿Puedo usar el sistema en mi celular?**
R: Sí, el sistema es responsive y funciona en dispositivos móviles.

---

# 9. Solución de Problemas

## 9.1 Problemas Comunes

| Problema | Solución |
|----------|----------|
| La página no carga | Verifique su conexión a internet. Pruebe recargar la página (F5). |
| No puedo iniciar sesión | Verifique credenciales. Limpie caché del navegador. |
| El botón no funciona | Asegúrese de tener JavaScript habilitado. Pruebe otro navegador. |
| No veo mis préstamos | Verifique que haya iniciado sesión correctamente. |
| Error "No autorizado" | Su sesión expiró. Cierre sesión y vuelva a iniciar. |

## 9.2 Mensajes de Error

| Código | Mensaje | Significado |
|--------|---------|-------------|
| 400 | "Datos inválidos" | Verifique la información ingresada |
| 401 | "No autorizado" | Debe iniciar sesión |
| 403 | "Acceso denegado" | No tiene permisos para esta acción |
| 404 | "No encontrado" | El recurso solicitado no existe |
| 500 | "Error del servidor" | Problema técnico, intente más tarde |

---

# 10. Contacto y Soporte

## 10.1 Información de Contacto

| Canal | Información |
|-------|-------------|
| **Email** | soporte@biblioteca.com |
| **Teléfono** | +56 9 XXXX XXXX |
| **Horario** | Lunes a Viernes, 9:00 - 18:00 |

## 10.2 Reportar un Problema

Para reportar un problema técnico, incluya:

1. Descripción detallada del problema
2. Pasos para reproducirlo
3. Capturas de pantalla si es posible
4. Navegador y sistema operativo utilizado

---

# ANEXOS

## Anexo A: Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `Ctrl + F` | Buscar en la página |
| `F5` | Recargar página |
| `Esc` | Cerrar diálogos |

## Anexo B: Glosario

| Término | Definición |
|---------|------------|
| **Préstamo** | Acción de solicitar un libro por un período determinado |
| **ISBN** | International Standard Book Number, código único de identificación de libros |
| **Catálogo** | Lista completa de libros disponibles en la biblioteca |
| **Dashboard** | Panel de control con estadísticas resumidas |

---

## Lista de Figuras

| Número | Título |
|--------|--------|
| Figura 1 | Página de Inicio del Sistema |
| Figura 2 | Barra de Navegación Principal |
| Figura 3 | Formulario de Registro de Usuario |
| Figura 4 | Confirmación de Registro Exitoso |
| Figura 5 | Formulario de Inicio de Sesión |
| Figura 6 | Usuario Autenticado en el Sistema |
| Figura 7 | Catálogo de Libros Disponibles |
| Figura 8 | Búsqueda de Libros por Título o Autor |
| Figura 9 | Filtrado de Libros por Categoría |
| Figura 10 | Vista de Detalle de Libro |
| Figura 11 | Confirmación de Solicitud de Préstamo |
| Figura 12 | Préstamo Pendiente de Aprobación |
| Figura 13 | Vista de Mis Préstamos |
| Figura 14 | Proceso de Devolución de Libro |
| Figura 15 | Panel Principal de Administración |
| Figura 16 | Formulario de Nuevo Libro |
| Figura 17 | Edición de Información de Libro |
| Figura 18 | Gestión de Usuarios del Sistema |
| Figura 19 | Préstamos Pendientes de Aprobación |
| Figura 20 | Aprobación de Solicitud de Préstamo |
| Figura 21 | Dashboard de Estadísticas del Sistema |

---

**Fin del Manual de Usuario**

---

**Documento elaborado por:** [Nombre del equipo]  
**Versión:** 1.0  
**Fecha:** 28/11/2024









