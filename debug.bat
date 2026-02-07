@echo off
cd /d "%~dp0"
echo Running debug... output saved to debug.log
echo.

echo ===== DEBUG LOG ===== > debug.log
echo Date: %date% %time% >> debug.log
echo. >> debug.log

echo [1] Node version: >> debug.log
node --version >> debug.log 2>&1

echo. >> debug.log
echo [2] npm version: >> debug.log
npm --version >> debug.log 2>&1

echo. >> debug.log
echo [3] Directory: >> debug.log
cd >> debug.log

echo. >> debug.log
echo [4] Files: >> debug.log
dir /b >> debug.log

echo. >> debug.log
echo [5] package.json exists: >> debug.log
if exist "package.json" (echo YES >> debug.log) else (echo NO >> debug.log)

echo. >> debug.log
echo [6] node_modules exists: >> debug.log
if exist "node_modules" (echo YES >> debug.log) else (echo NO >> debug.log)

echo. >> debug.log
echo [7] Running npm install: >> debug.log
call npm install >> debug.log 2>&1

echo. >> debug.log
echo [8] Running npm run dev: >> debug.log
call npm run dev >> debug.log 2>&1

echo.
echo Done! Check debug.log file
echo.
pause
