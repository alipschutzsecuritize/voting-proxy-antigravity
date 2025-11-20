#!/bin/bash

# Quick Start Script - Runs all services in the background
# Use this for quick testing. For development, run each service in separate terminals.

echo "🚀 Starting On-Chain Voting System..."
echo ""

# Check if hardhat node is already running
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Hardhat node is already running on port 8545"
else
    echo "Starting Hardhat node..."
    cd contracts
    npx hardhat node > hardhat.log 2>&1 &
    HARDHAT_PID=$!
    echo "✓ Hardhat node started (PID: $HARDHAT_PID)"
    cd ..
    sleep 3
fi

# Deploy contracts
echo "Deploying contracts..."
cd contracts
node scripts/deploy.js > deploy.log 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Contracts deployed successfully"
    echo "📋 Check contracts/deploy.log for addresses"
else
    echo "❌ Contract deployment failed. Check contracts/deploy.log"
    exit 1
fi
cd ..

# Start backend
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Backend is already running on port 3000"
else
    echo "Starting backend..."
    cd backend
    npm run start > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "✓ Backend started (PID: $BACKEND_PID)"
    cd ..
    sleep 2
fi

# Start frontend
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Frontend is already running on port 5173"
else
    echo "Starting frontend..."
    cd frontend
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✓ Frontend started (PID: $FRONTEND_PID)"
    cd ..
fi

echo ""
echo "✅ All services started!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:3000"
echo "⛓️  Hardhat Node: http://localhost:8545"
echo ""
echo "📋 Logs:"
echo "  - Hardhat: contracts/hardhat.log"
echo "  - Backend: backend/backend.log"
echo "  - Frontend: frontend/frontend.log"
echo ""
echo "To stop all services, run: ./stop.sh"
echo ""
