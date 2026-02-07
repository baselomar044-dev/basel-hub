@echo off
title Basel Hub v10
cd /d "%~dp0"

echo ========================================
echo    Basel Hub v10 - Starting...
echo ========================================
echo.

:: Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js NOT FOUND!
    echo.
    echo Download from: https://nodejs.org
    echo.
    pause
    exit /b
)

echo [OK] Node.js found
echo.

:: Install if needed
if not exist "node_modules" (
    echo [INSTALLING] npm install...
    echo This takes 1-2 minutes...
    echo.
    npm install
    echo.
)

echo [STARTING] npm run dev...
echo.
echo ----------------------------------------
echo   OPEN: http://localhost:3000
echo ----------------------------------------
echo.

npm run dev

echo.
echo ========================================
echo   Server stopped or error occurred
echo ========================================
echo.
pause
