@echo off
setlocal enabledelayedexpansion

REM AI Task Generator - Windows Installation Script

echo.
echo ========================================================
echo.
echo       AI Task Generator - Setup Script (Windows)
echo.
echo ========================================================
echo.

REM Check if Node.js is installed
echo [INFO] Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo.
    echo Please install Node.js 18 or higher from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js %NODE_VERSION% detected

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm %NPM_VERSION% detected

echo.

REM Check if .env.local exists
echo [INFO] Checking environment configuration...
if not exist ".env.local" (
    if exist ".env.example" (
        echo [WARNING] .env.local not found, creating from .env.example
        copy .env.example .env.local >nul
        echo [SUCCESS] Created .env.local
        echo.
        echo [WARNING] IMPORTANT: You need to add your Gemini API key!
        echo.
        echo   1. Get your API key from: https://makersuite.google.com/app/apikey
        echo   2. Edit .env.local and replace 'your_gemini_api_key_here'
        echo.

        set /p ADD_KEY="Do you have your API key ready? (y/n): "
        if /i "!ADD_KEY!"=="y" (
            set /p API_KEY="Enter your Gemini API key: "
            powershell -Command "(gc .env.local) -replace 'your_gemini_api_key_here', '!API_KEY!' | Out-File -encoding ASCII .env.local"
            echo [SUCCESS] API key added to .env.local
        ) else (
            echo [WARNING] Remember to add your API key to .env.local before running the app
        )
    ) else (
        echo [ERROR] .env.example not found
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] .env.local already exists
)

echo.

REM Install dependencies
echo [INFO] Installing dependencies...
echo.

call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencies installed successfully

echo.

REM Check if installation was successful
if exist "node_modules" (
    echo [SUCCESS] node_modules directory created
) else (
    echo [ERROR] node_modules directory not found
    pause
    exit /b 1
)

echo.
echo ========================================================
echo.
echo           Installation Complete! 🎉
echo.
echo ========================================================
echo.

echo [INFO] Next steps:
echo.
echo   1. Start the development server:
echo      npm run dev
echo.
echo   2. Open your browser:
echo      http://localhost:3000
echo.
echo   3. Enter a project description and click 'Analyze Project'
echo.

REM Check if API key is set
findstr /C:"your_gemini_api_key_here" .env.local >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo [WARNING] Don't forget to add your Gemini API key to .env.local!
    echo            Get it from: https://makersuite.google.com/app/apikey
    echo.
)

echo [INFO] For more information, see SETUP.md
echo.
echo [SUCCESS] Happy coding! 🚀
echo.

pause
