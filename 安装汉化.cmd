@echo off
chcp 65001 >nul
set "GAME_ROOT=%~dp0."
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\install.ps1" -GameRoot "%GAME_ROOT%"
if errorlevel 1 (
  echo 安装失败，请查看上面的提示。
  pause
  exit /b 1
)
pause
