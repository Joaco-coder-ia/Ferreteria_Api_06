@echo off
setlocal
cd /d "%~dp0"

where pnpm >nul 2>&1
if not errorlevel 1 goto run-pnpm

where npm >nul 2>&1
if not errorlevel 1 goto run-npm

for /d %%D in ("%USERPROFILE%\.cache\codex-runtimes\*\dependencies\bin\fallback") do (
  if exist "%%~D\pnpm.cmd" (
    call "%%~D\pnpm.cmd" dev
    exit /b 0
  )
)

echo No se encontró Node.js/pnpm. Instala Node.js LTS o usa la terminal preparada del proyecto.
exit /b 1

:run-pnpm
pnpm dev
exit /b %errorlevel%

:run-npm
npm run dev
exit /b %errorlevel%
