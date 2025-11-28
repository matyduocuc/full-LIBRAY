@echo off
echo ============================================
echo    INICIANDO MICROSERVICIOS BIBLIOTECA
echo ============================================
echo.

echo [1/4] Iniciando MS-USUARIOS (puerto 8081)...
start "MS-USUARIOS" cmd /k "cd ms-usuarios && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

echo [2/4] Iniciando MS-LIBROS (puerto 8082)...
start "MS-LIBROS" cmd /k "cd ms-libros && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

echo [3/4] Iniciando MS-PRESTAMOS (puerto 8083)...
start "MS-PRESTAMOS" cmd /k "cd ms-prestamos && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

echo [4/4] Iniciando MS-INFORMES (puerto 8085)...
start "MS-INFORMES" cmd /k "cd ms-informes && mvn spring-boot:run"

echo.
echo ============================================
echo    TODOS LOS MICROSERVICIOS INICIADOS
echo ============================================
echo.
echo Swagger UI disponible en:
echo   - Usuarios:  http://localhost:8081/swagger-ui.html
echo   - Libros:    http://localhost:8082/swagger-ui.html
echo   - Prestamos: http://localhost:8083/swagger-ui.html
echo   - Informes:  http://localhost:8085/swagger-ui.html
echo.
echo Credenciales: admin@biblioteca.com / admin123
echo.
pause








