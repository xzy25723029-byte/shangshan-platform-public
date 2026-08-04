@echo off
chcp 65001 >nul
rem ============================================================
rem  上善若水 · 一键全量检查（Windows 双击即用）
rem  自动定位项目目录、自动启动/复用 dev server，然后执行
rem  full-check（lint + build + qa + matrix + audit）
rem ============================================================
cd /d "%~dp0"

echo [1/3] 检查 dev server（127.0.0.1:4173）...
curl -s -o nul -w "%%{http_code}" http://127.0.0.1:4173/ > "%TEMP%\ss_dev_check.txt" 2>nul
set /p DEV_CODE=<"%TEMP%\ss_dev_check.txt"
if "%DEV_CODE%"=="200" (
  echo       dev server 已在运行，直接使用。
) else (
  echo       dev server 未运行，正在后台启动...
  start "ss-dev" /min cmd /c "npm run dev > qa\dev-server.log 2>&1"
  timeout /t 7 /nobreak >nul
  curl -s -o nul http://127.0.0.1:4173/ && (echo       dev server 已就绪。) || (
    echo [错误] dev server 启动失败，请查看 qa\dev-server.log
    pause
    exit /b 1
  )
)

echo [2/3] 执行全量检查（lint + build + qa + matrix + audit）...
call npm run full-check
set CHECK_CODE=%ERRORLEVEL%

echo [3/3] 收尾...
echo.
if "%CHECK_CODE%"=="0" (
  echo ============================================
  echo  全部检查通过：lint / build / qa / matrix / audit
  echo  报告：qa\matrix-report.md  和  qa\audit\ISSUES.md
  echo ============================================
) else (
  echo ============================================
  echo  检查未通过（退出码 %CHECK_CODE%），请查看上方失败项。
  echo  报告：qa\matrix-report.md  和  qa\audit\ISSUES.md
  echo ============================================
)
if not "%1"=="nopause" pause
exit /b %CHECK_CODE%
