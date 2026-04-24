@echo off
title 실행 중 - 청년이슈픽
cd /d "%~dp0"
echo 서버 시작 중... (http://localhost:3000)
start "" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
start http://localhost:3000
