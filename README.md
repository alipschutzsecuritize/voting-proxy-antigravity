# On-Chain Token-Based Voting System

A decentralized voting system enabling Web3 users to vote on proposals based on token holdings at a snapshot block.

## Project Structure

```
proxy-voting/
├── contracts/          # Smart contracts (Hardhat)
├── backend/           # NestJS API server
└── frontend/          # React + TypeScript UI
```

## Features

- ✅ **Smart Contracts**: OpenZeppelin Governor-based voting with ERC20Votes token
- ✅ **Backend API**: NestJS with TypeORM and SQLite database
- ✅ **Frontend**: React with Reown (WalletConnect) integration
- ✅ **Snapshot Voting**: Vote weight based on token balance at proposal snapshot block
- ✅ **Off-chain Vote Storage**: Vote choices stored in database, only participation recorded on-chain

## Prerequisites

- Node.js v22+ (recommended, v25 has warnings with Hardhat)
- npm or yarn

## Quick Start

### 1. Smart Contracts

```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Start local Hardhat node (in a separate terminal)
npx hardhat node

# Deploy contracts (in another terminal)
node scripts/deploy.js
```

**Note the deployed contract addresses** - you'll need them for the frontend.

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Start the server
npm run start
```

The API will be available at `http://localhost:3000`

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Update the token address in src/pages/Home.tsx
# Replace '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' with your deployed token address

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Smart Contracts

### VotingToken.sol
ERC20Votes token with snapshot capabilities for governance.

### VotingGovernor.sol
Governor contract with:
- `registerVote(proposalId)` - Records that a wallet voted (no choice on-chain)
- `hasVoted(proposalId, account)` - Check if an address has voted
- `getSnapshotBlock(proposalId)` - Get the snapshot block for a proposal
- `getBalanceAt(holder, snapshotBlock)` - Get token balance at snapshot
- `getTotalSupplyAt(snapshotBlock)` - Get total supply at snapshot

## API Endpoints

### Proposals
- `GET /proposals` - Get all proposals
- `GET /proposals/token/:tokenAddress` - Get proposals for a specific token
- `GET /proposals/:id` - Get a specific proposal
- `POST /proposals` - Create a new proposal

### Votes
- `GET /votes` - Get all votes
- `GET /votes/proposal/:proposalId` - Get votes for a specific proposal
- `POST /votes` - Submit a vote

## Database Schema

### voting_proposal
- `id` (UUID)
- `title` (string)
- `description` (string)
- `creation_date` (timestamp)
- `hash` (string) - On-chain proposal ID
- `contract_address` (string) - Governor contract address
- `token_address` (string) - Associated ERC20 token
- `expiration` (date)
- `snapshot_block` (string)

### voting_result
- `id` (UUID)
- `holder_wallet` (string)
- `proposal_id` (string)
- `answer` (enum: 0=YES, 1=NO, 2=ABSTAIN)
- `weight` (string)
- `creation_date` (timestamp)
- `transaction` (string) - Transaction hash

## Usage Flow

1. **Connect Wallet**: User connects MetaMask via Reown/WalletConnect
2. **View Tokens**: Home page shows tokens with active proposals
3. **Browse Proposals**: Click on a token to see its proposals
4. **Vote**: 
   - Select a proposal
   - Choose Yes/No/Abstain
   - Sign transaction to call `registerVote()`
   - Vote choice is stored in backend with transaction hash
5. **View Results**: See aggregated vote counts

## Creating a Proposal

Currently, proposals need to be created via the API. Example:

```bash
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Proposal Title",
    "description": "Proposal description",
    "hash": "123456789",
    "contract_address": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "token_address": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "expiration": "2025-12-31T23:59:59Z",
    "snapshot_block": "1000"
  }'
```

## Configuration

### Frontend - Reown Project ID
Update `frontend/src/context/Web3Modal.tsx`:
```typescript
const projectId = 'YOUR_REOWN_PROJECT_ID'
```

Get a project ID at: https://cloud.reown.com/

### Network Configuration
The app is configured for localhost by default. To use other networks, update:
- `frontend/src/context/Web3Modal.tsx` - Add/modify networks
- `contracts/hardhat.config.js` - Add network configurations

## Development Notes

### Node.js Version
Hardhat 3.x requires Node.js v22 LTS. If using v25, you'll see warnings but it should still work.

### Database
SQLite database (`adfam_proposals_db.sqlite`) is created automatically in the backend directory.

### CORS
The backend has CORS enabled for `http://localhost:5173` by default.

## Testing

### Smart Contracts
```bash
cd contracts
npx hardhat test
```

### Backend
```bash
cd backend
npm run test
```

## Production Deployment

1. **Contracts**: Deploy to your target network (Ethereum, Polygon, etc.)
2. **Backend**: 
   - Switch to PostgreSQL/MySQL for production
   - Set up environment variables
   - Deploy to your server/cloud platform
3. **Frontend**:
   - Update contract addresses
   - Update API endpoint
   - Build: `npm run build`
   - Deploy static files

## Security Considerations

- ✅ One vote per wallet per proposal enforced on-chain
- ✅ Snapshot prevents vote manipulation
- ⚠️ Vote choices are stored off-chain (not cryptographically secured)
- ⚠️ No access control on proposal creation (add authentication in production)
- ⚠️ Mint function is public (should be restricted in production)

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
