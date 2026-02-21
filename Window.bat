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
echo %ESC%[32m[+] ACTION: %ESC%[1;37mSTARTING ENGINE...%ESC%[0m
echo.

:: We use 'call' and 'pnpm run start' for the most reliable execution
call pnpm run start

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