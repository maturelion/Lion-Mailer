@echo off
title LION-MAILER ENGINE

:start
cls
echo =========================================
echo       LION-MAILER IS STARTING...
echo =========================================
echo.

:: We use 'call' and 'pnpm run start' for the most reliable execution
call pnpm run start

echo.
echo =========================================
echo       CAMPAIGN FINISHED OR STOPPED
echo =========================================
echo.
echo The window is being kept open for you to see the results.
echo Press any key to RESTART the mailer.
echo.
pause
goto start