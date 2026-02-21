@echo off
SETLOCAL EnableExtensions EnableDelayedExpansion

:: This is a more robust way to get the ESC character in Batch
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "ESC=%%b"
)

title LION-MAILER ENGINE

:start
cls
echo %ESC%[38;5;214m
echo    .      .
echo    ^|\____/^|
echo   (\ ^^  ^^ /)
echo    (_  v  _)   %ESC%[1;37mLION-MAILER%ESC%[0m
echo %ESC%[38;5;214m     /     \    %ESC%[38;5;240mv1.0.0%ESC%[0m
echo %ESC%[38;5;214m    (_/ ^^\_)
echo %ESC%[0m
echo %ESC%[1;33m=========================================%ESC%[0m
echo %ESC%[1;37m      LION-MAILER MODERN ENGINE          %ESC%[0m
echo %ESC%[1;33m=========================================%ESC%[0m
echo.
echo %ESC%[32m[+] STATUS: %ESC%[1;32mREADY%ESC%[0m
echo %ESC%[32m[+] ACTION: %ESC%[1;37mCHECKING DEPENDENCIES...%ESC%[0m
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo %ESC%[33m[!] WARNING: node_modules not found. Installing dependencies...%ESC%[0m
    
    :: Check for pnpm
    where pnpm >nul 2>nul
    if !errorlevel! equ 0 (
        echo %ESC%[32m[+] Found pnpm. Installing...%ESC%[0m
        call pnpm install
    ) else (
        :: Fallback to npm
        where npm >nul 2>nul
        if !errorlevel! equ 0 (
            echo %ESC%[33m[!] pnpm not found. Falling back to npm...%ESC%[0m
            call npm install
        ) else (
            echo.
            echo %ESC%[31m[!] ERROR: Neither pnpm nor npm found!%ESC%[0m
            echo %ESC%[1;37mPlease install Node.js from https://nodejs.org/%ESC%[0m
            echo %ESC%[1;37mThen run: npm install -g pnpm%ESC%[0m
            echo.
            pause
            exit /b 1
        )
    )

    if !errorlevel! neq 0 (
        echo.
        echo %ESC%[31m[!] ERROR: Failed to install dependencies.%ESC%[0m
        pause
        exit /b !errorlevel!
    )
    echo %ESC%[32m[+] SUCCESS: Dependencies installed successfully.%ESC%[0m
    echo.
)

set "ENV_FILE=%~1"
if "!ENV_FILE!"=="" set "ENV_FILE=config.env"
set "ENV_PARAM=--env=!ENV_FILE!"

echo %ESC%[32m[+] CONFIG: %ESC%[1;37mUSING ENV: !ENV_FILE!%ESC%[0m

echo %ESC%[32m[+] ACTION: %ESC%[1;37mSTARTING ENGINE...%ESC%[0m
echo.

:: We use 'call' and 'pnpm run start' for the most reliable execution
call pnpm run start -- %ENV_PARAM%

echo.
echo %ESC%[33m=========================================%ESC%[0m
echo %ESC%[1;31m       CAMPAIGN FINISHED OR STOPPED      %ESC%[0m
echo %ESC%[33m=========================================%ESC%[0m
echo.
echo %ESC%[38;5;244mThe window is being kept open for you to see the results.%ESC%[0m
echo %ESC%[1;37mPress any key to %ESC%[1;32mRESTART%ESC%[1;37m the mailer.%ESC%[0m
echo.
pause
goto start