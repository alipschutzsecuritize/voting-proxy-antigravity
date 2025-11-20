@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║  On-Chain Voting System - Quick Setup Script          ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    exit /b 1
)
echo ✓ Node.js installed

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    exit /b 1
)
echo ✓ npm installed

echo.
echo Installing dependencies...

echo 📦 Installing contracts dependencies...
cd contracts
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install contracts dependencies
    exit /b 1
)
echo ✓ Contracts dependencies installed

echo 📦 Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✓ Backend dependencies installed

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✓ Frontend dependencies installed

cd ..

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  Installation Complete!                                ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo 1. Start Hardhat node (Terminal 1):
echo    cd contracts ^&^& npx hardhat node
echo.
echo 2. Deploy contracts (Terminal 2):
echo    cd contracts ^&^& node scripts/deploy.js
echo.
echo 3. Update contract addresses in frontend/src/constants.ts
echo.
echo 4. Start backend (Terminal 3):
echo    cd backend ^&^& npm run start
echo.
echo 5. Start frontend (Terminal 4):
echo    cd frontend ^&^& npm run dev
echo.
echo 6. Configure MetaMask:
echo    - Network: Hardhat Local
echo    - RPC: http://127.0.0.1:8545
echo    - Chain ID: 1337
echo    - Import account with the first Hardhat private key
echo.
echo 📚 See README.md for detailed instructions
echo.
pause
