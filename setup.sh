#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  On-Chain Voting System - Quick Setup Script          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"

# Install contracts dependencies
echo -e "${YELLOW}📦 Installing contracts dependencies...${NC}"
cd contracts
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install contracts dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Contracts dependencies installed${NC}"

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd ../backend
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd ../frontend
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Installation Complete!                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo -e "1. ${GREEN}Start Hardhat node${NC} (Terminal 1):"
echo -e "   cd contracts && npx hardhat node"
echo ""
echo -e "2. ${GREEN}Deploy contracts${NC} (Terminal 2):"
echo -e "   cd contracts && node scripts/deploy.js"
echo ""
echo -e "3. ${GREEN}Update contract addresses${NC} in frontend/src/constants.ts"
echo ""
echo -e "4. ${GREEN}Start backend${NC} (Terminal 3):"
echo -e "   cd backend && npm run start"
echo ""
echo -e "5. ${GREEN}Start frontend${NC} (Terminal 4):"
echo -e "   cd frontend && npm run dev"
echo ""
echo -e "6. ${GREEN}Configure MetaMask${NC}:"
echo -e "   - Network: Hardhat Local"
echo -e "   - RPC: http://127.0.0.1:8545"
echo -e "   - Chain ID: 1337"
echo -e "   - Import account with the first Hardhat private key"
echo ""
echo -e "📚 See README.md for detailed instructions"
echo ""
