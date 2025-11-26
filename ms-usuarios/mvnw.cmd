@REM Maven Wrapper script for Windows
@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"

if not exist %WRAPPER_JAR% (
    echo Descargando Maven Wrapper...
    mkdir "%MAVEN_PROJECTBASEDIR%.mvn\wrapper" 2>nul
    powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar'"
)

"%JAVA_HOME%\bin\java.exe" -jar %WRAPPER_JAR% %*
if ERRORLEVEL 1 goto error
goto end

:error
echo Error ejecutando Maven
exit /b 1

:end
endlocal
