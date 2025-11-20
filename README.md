# On-Chain Token-Based Voting System

A decentralized voting system enabling Web3 users to vote on proposals based on token holdings. Features a React frontend, NestJS backend API, and Solidity smart contracts.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step-by-Step Setup](#step-by-step-setup)
- [Creating Proposals](#creating-proposals)
- [Using the Application](#using-the-application)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Smart Contracts**: OpenZeppelin Governor-based voting with ERC20Votes token
- **Backend API**: NestJS with TypeORM and SQLite database
- **Frontend**: React + TypeScript with Reown (WalletConnect) wallet integration
- **Snapshot Voting**: Vote weight based on token balance at proposal creation
- **Off-chain Vote Storage**: Vote choices stored in database, only participation recorded on-chain
- **One Vote Per Wallet**: Enforced on-chain to prevent double voting

## 📦 Prerequisites

- **Node.js**: v18+ (v22 LTS recommended)
- **npm** or **yarn**
- **MetaMask**: Browser extension installed
- **Git**: For cloning the repository

## 🚀 Quick Start

Run the entire system with these commands:

```bash
# 1. Clone and install all dependencies
git clone <repository-url>
cd antigravity-voting

# Install all dependencies
cd contracts && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Start Hardhat node (Terminal 1)
cd contracts
npx hardhat node

# 3. Deploy contracts (Terminal 2)
cd contracts
node scripts/deploy.js
# Note the deployed addresses!

# 4. Update frontend constants (use addresses from step 3)
# Edit frontend/src/constants.ts with the deployed addresses

# 5. Start backend (Terminal 3)
cd backend
npm run start

# 6. Start frontend (Terminal 4)
cd frontend
npm run dev
```

Access the app at `http://localhost:5173`

## 📖 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd antigravity-voting

# Install dependencies for each component
cd contracts && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 2: Start Hardhat Local Node

Open a new terminal and run:

```bash
cd contracts
npx hardhat node
```

**Important**: Keep this terminal running. You'll see 20 accounts with private keys - save the first account address (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`) for later.

### Step 3: Deploy Smart Contracts

In a **new terminal**, deploy the contracts:

```bash
cd contracts
node scripts/deploy.js
```

You'll see output like:
```
VotingToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
VotingGovernor deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Minted 10000 tokens to deployer and delegated
```

**📝 Copy these addresses!** You'll need them in the next step.

### Step 4: Update Frontend Configuration

Edit `frontend/src/constants.ts` with your deployed addresses:

```typescript
export const DEPLOYED_CONTRACTS = {
    VotingToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',      // Your token address
    VotingGovernor: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',  // Your governor address
} as const;

export const API_BASE_URL = 'http://localhost:3000';
```

### Step 5: Configure MetaMask

1. **Add Hardhat Network to MetaMask**:
   - Open MetaMask → Settings → Networks → Add Network
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`

2. **Import Test Account**:
   - Copy the first private key from the Hardhat node terminal (starts with `0xac0974...`)
   - MetaMask → Account icon → Import Account → Paste private key
   - This account has 10,000 ETH and 10,000 VTK tokens with voting power

### Step 6: Start Backend API

In a **new terminal**:

```bash
cd backend
npm run start
```

Backend will start on `http://localhost:3000`. You'll see:
```
[Nest] Starting Nest application...
[Nest] Nest application successfully started
```

The SQLite database (`adfam_proposals_db.sqlite`) will be created automatically.

### Step 7: Start Frontend

In a **new terminal**:

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

### Step 8: Create Test Proposals

Create some proposals using the API:

```bash
# Proposal 1
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Should we increase the treasury allocation?",
    "description": "This proposal suggests increasing the treasury allocation from 10% to 15% to fund more community initiatives.",
    "hash": "1",
    "contract_address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "token_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "expiration": "2025-12-31T23:59:59Z",
    "snapshot_block": "1"
  }'

# Proposal 2
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature Proposal",
    "description": "Should we implement feature X?",
    "hash": "2",
    "contract_address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "token_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "expiration": "2025-12-31T23:59:59Z",
    "snapshot_block": "1"
  }'
```

**Note**: Replace the contract addresses with your actual deployed addresses from Step 3.

## 🎯 Using the Application

1. **Open the app**: Navigate to `http://localhost:5173`
2. **Connect wallet**: Click "Connect Wallet" and select your imported MetaMask account
3. **View proposals**: You'll see the proposals created in Step 8
4. **Vote**: 
   - Click on a proposal
   - Choose "Yes", "No", or "Abstain"
   - Confirm the transaction in MetaMask
   - Your vote will be recorded both on-chain and in the database
5. **View results**: See real-time vote counts

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  React + TypeScript + Vite
│  (Port 5173)    │  - Reown WalletConnect integration
└────────┬────────┘  - Web3 interactions via viem/wagmi
         │
         ├──────────► Smart Contracts (Hardhat Local Node)
         │            - VotingToken (ERC20Votes)
         │            - VotingGovernor
         │
         └──────────► Backend API (Port 3000)
                      - NestJS + TypeORM
                      - SQLite database
```

### Smart Contracts

**VotingToken.sol** - ERC20Votes token with:
- Standard ERC20 functionality
- Voting power via delegation
- Snapshot capabilities

**VotingGovernor.sol** - Governance contract with:
- `registerVote(proposalId)` - Records vote on-chain
- `hasVoted(proposalId, account)` - Check if address voted
- Off-chain proposal support (no on-chain proposal creation needed)

### Backend API Endpoints

**Proposals**:
- `GET /proposals` - List all proposals
- `GET /proposals/:id` - Get specific proposal
- `GET /proposals/token/:tokenAddress` - Get proposals for a token
- `POST /proposals` - Create new proposal
- `PATCH /proposals/:id` - Update proposal
- `DELETE /proposals/:id` - Delete proposal

**Votes**:
- `GET /votes` - List all votes
- `GET /votes/proposal/:proposalId` - Get votes for a proposal
- `POST /votes` - Submit a vote

### Database Schema

**voting_proposal**:
- `id` (UUID) - Primary key
- `title` (string) - Proposal title
- `description` (string) - Detailed description
- `hash` (string) - Proposal ID for on-chain calls
- `contract_address` (string) - Governor contract address
- `token_address` (string) - Associated token address
- `expiration` (date) - Voting deadline
- `snapshot_block` (string) - Block number for vote weight calculation
- `creation_date` (timestamp) - When created

**voting_result**:
- `id` (UUID) - Primary key
- `holder_wallet` (string) - Voter's address
- `proposal_id` (UUID) - Reference to proposal
- `answer` (enum) - 0=YES, 1=NO, 2=ABSTAIN
- `weight` (string) - Voting power used
- `transaction` (string) - On-chain transaction hash
- `creation_date` (timestamp) - When voted

## 🔧 Troubleshooting

### "Connection to localhost:8545 failed"
**Solution**: Make sure the Hardhat node is running (`npx hardhat node`)

### "Contract not deployed"
**Solution**: 
1. Deploy contracts: `node scripts/deploy.js`
2. Update addresses in `frontend/src/constants.ts`

### "Transaction failed with chainId mismatch"
**Solution**: 
- Make sure MetaMask is connected to the Hardhat network (chainId: 1337)
- Check network settings in MetaMask

### "User has no voting power"
**Solution**: 
- Make sure you're using the first Hardhat account (`0xf39Fd...`)
- This account has tokens automatically delegated during deployment
- For other accounts, you need to:
  ```bash
  # Check voting power
  node scripts/check-voting-power.js
  ```

### "Vote already cast" error
**Solution**: Each wallet can only vote once per proposal. Create a new proposal to test again.

### Backend won't start
**Solution**: 
- Delete `backend/adfam_proposals_db.sqlite` and restart
- Check that port 3000 is not in use

### Frontend shows old contract addresses
**Solution**: 
- Clear browser cache and reload
- Verify `frontend/src/constants.ts` has correct addresses

## 🔐 Security Notes

- ✅ One vote per wallet enforced on-chain
- ✅ Vote weights based on token snapshot
- ⚠️ Vote choices stored off-chain (not end-to-end encrypted)
- ⚠️ No authentication on proposal creation (add in production)
- ⚠️ Token mint function is public (restrict in production)
- ⚠️ Never use Hardhat private keys on mainnet!

## 🛠️ Development Scripts

### Contracts
```bash
cd contracts

# Compile
npx hardhat compile

# Run tests
npx hardhat test

# Check user voting power
node scripts/check-voting-power.js

# Create a proposal on-chain (if needed)
node scripts/create-proposal.js
```

### Backend
```bash
cd backend

# Development mode with auto-reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test
```

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 📝 Creating More Test Accounts with Tokens

To give tokens to other Hardhat accounts:

```bash
cd contracts

# Create a script: scripts/mint-tokens.js
node -e "
const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = await provider.getSigner();
  
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const tokenArtifact = JSON.parse(fs.readFileSync('./artifacts/contracts/VotingToken.sol/VotingToken.json', 'utf8'));
  const token = new ethers.Contract(tokenAddress, tokenArtifact.abi, signer);
  
  const recipient = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Second Hardhat account
  await token.mint(recipient, ethers.parseEther('1000'));
  console.log('Minted 1000 tokens to', recipient);
  
  // Must delegate to self to get voting power
  const recipientSigner = await provider.getSigner(recipient);
  const tokenAsRecipient = token.connect(recipientSigner);
  await tokenAsRecipient.delegate(recipient);
  console.log('Delegated voting power');
}

main();
"
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Made with ❤️ using OpenZeppelin, NestJS, and React**
