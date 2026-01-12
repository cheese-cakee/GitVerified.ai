@echo off
echo Starting CandidateAI Hybrid System...
echo.

REM Check if Docker Desktop is running
tasklist | find /c /Windows/System32/cmd.exe /c ica~1 | findstr "docker.exe"

REM Start Docker services if not running
docker-compose -f docker-compose.simple.yml up -d

REM Start Python backend server if not running
"C:\Users\lenovo\AppData\Local\Programs\Microsoft\WindowsApps\python.exe" "C:\Users\lenovo\RealEngineers.ai\start_hybrid_system.py"

REM Start web interface
start "" "C:\Users\lenovo\RealEngineers.ai\web\upload.html"

echo ✅ System started successfully!
echo.
echo.
echo 🚀 Open these URLs when ready:
echo   - Kestra Dashboard: http://localhost:8081
echo   - Web Interface: http://localhost:3000
echo   - Resume Evaluation: http://localhost:3000/evaluate
echo.
echo.
echo 📋 All services running!

PAUSE
pause