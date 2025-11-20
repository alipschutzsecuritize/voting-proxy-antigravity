#!/bin/bash

echo "🛑 Stopping On-Chain Voting System..."
echo ""

# Kill processes by port
kill_port() {
    PORT=$1
    NAME=$2
    PID=$(lsof -ti:$PORT)
    if [ ! -z "$PID" ]; then
        kill $PID 2>/dev/null
        echo "✓ Stopped $NAME (port $PORT)"
    else
        echo "⚠️  $NAME is not running on port $PORT"
    fi
}

# Stop hardhat node (port 8545)
kill_port 8545 "Hardhat node"

# Stop backend (port 3000)
kill_port 3000 "Backend"

# Stop frontend (port 5173)
kill_port 5173 "Frontend"

# Also kill by process name as fallback
pkill -f "hardhat node" 2>/dev/null
pkill -f "nest start" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo ""
echo "✅ All services stopped"
echo ""
