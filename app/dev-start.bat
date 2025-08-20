@echo off
:: Development startup script for AntikTV Tauri app (Windows)
:: This script starts the SvelteKit dev server

echo 🚀 Starting AntikTV Tauri Development Environment

:: Check if MPV is installed
where mpv >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MPV not found! Please install MPV:
    echo   - Download from https://mpv.io/installation/
    echo   - Or use chocolatey: choco install mpv
    echo   - Or use scoop: scoop install mpv
    exit /b 1
)

echo ✅ MPV found

:: Set development environment
set NODE_ENV=development

:: Start SvelteKit dev server
echo 🌐 Starting SvelteKit dev server...
npm run dev
