# Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Reown/WC   │  │  React Query │  │  Wagmi/Viem/ethers  │  │
│  │  (Wallet)    │  │   (State)    │  │   (Blockchain)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON-RPC
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Controllers │  │   Services   │  │    TypeORM/SQLite    │  │
│  │   (REST)     │  │   (Logic)    │  │     (Database)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ ethers.js
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Blockchain (Ethereum/Hardhat)                  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │   VotingToken.sol    │  │    VotingGovernor.sol        │    │
│  │   (ERC20Votes)       │  │    (OpenZeppelin Governor)   │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Voting Flow

1. **User Connects Wallet**
   - Frontend: Reown modal opens
   - User selects MetaMask
   - Wallet connects via WalletConnect/EIP-1193

2. **User Views Proposals**
   - Frontend → Backend: `GET /proposals/token/:address`
   - Backend → Database: Query proposals by token_address
   - Backend → Frontend: Return proposal list

3. **User Votes**
   - Frontend: User selects vote choice (Yes/No/Abstain)
   - Frontend → Blockchain: Call `registerVote(proposalId)`
     - Smart contract records that wallet voted
     - Does NOT store vote choice on-chain
   - Blockchain → Frontend: Transaction hash returned
   - Frontend → Backend: `POST /votes` with choice + tx hash
   - Backend → Database: Store vote with choice

4. **View Results**
   - Frontend → Backend: `GET /votes/proposal/:id`
   - Backend → Database: Aggregate votes by answer
   - Backend → Frontend: Return vote counts

### Snapshot Mechanism

```
Proposal Created
    │
    ├─ Snapshot Block: 1000
    │
User Votes (Block 1500)
    │
    ├─ Contract checks: getBalanceAt(user, 1000)
    │  └─ Returns: User's token balance at block 1000
    │
    ├─ Contract checks: hasVoted(proposalId, user)
    │  └─ Returns: false (first vote)
    │
    └─ Vote recorded on-chain
       └─ Backend stores choice off-chain
```

## Smart Contract Architecture

### VotingToken (ERC20Votes)
- Extends OpenZeppelin's ERC20, ERC20Permit, ERC20Votes
- Automatically creates snapshots on transfers
- Enables delegation for voting power
- `mint()` function for testing (should be restricted in production)

### VotingGovernor (Governor)
- Extends OpenZeppelin's Governor, GovernorSettings, GovernorVotes
- Custom `registerVote()` function - only records participation
- `_countVote()` override - tracks hasVoted mapping
- `hasVoted()` public view function
- Helper functions for snapshot data

## Database Schema

### Entity Relationships

```
voting_proposal (1) ──── (N) voting_result
    │
    ├─ id (PK)
    ├─ title
    ├─ description
    ├─ hash (on-chain proposal ID)
    ├─ contract_address
    ├─ token_address
    ├─ expiration
    └─ snapshot_block
                              │
                              ├─ id (PK)
                              ├─ holder_wallet
                              ├─ proposal_id (FK)
                              ├─ answer (0/1/2)
                              ├─ weight
                              ├─ transaction
                              └─ creation_date
```

## Security Model

### On-Chain Security
✅ **Enforced:**
- One vote per wallet per proposal
- Snapshot prevents manipulation
- Vote weight based on historical balance

⚠️ **Not Enforced:**
- Vote choice privacy (stored off-chain)
- Proposal creation access control

### Off-Chain Security
✅ **Implemented:**
- Transaction hash verification
- Vote immutability (no updates)

⚠️ **Missing (Production TODO):**
- Authentication/Authorization
- Vote encryption
- Signature verification for vote choices
- Rate limiting
- Input validation/sanitization

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Reown AppKit** - Wallet connection
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Async state management
- **React Router** - Routing
- **Axios** - HTTP client

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - ORM
- **SQLite** - Database (dev)
- **Class Validator** - DTO validation
- **ethers.js** - Ethereum interaction

### Smart Contracts
- **Solidity 0.8.24** - Contract language
- **Hardhat** - Development environment
- **OpenZeppelin Contracts 5.4** - Battle-tested contracts
- **ethers.js** - Deployment scripts

## Key Design Decisions

### Why Off-Chain Vote Storage?
- **Privacy**: Vote choices not publicly visible on-chain
- **Cost**: Reduces gas costs significantly
- **Flexibility**: Easier to implement complex vote tallying
- **Trade-off**: Requires trust in backend/database

### Why Snapshot Voting?
- **Prevents manipulation**: Can't buy tokens after proposal to influence vote
- **Fair**: All voters judged by same point in time
- **Standard**: Widely used in DAOs (Snapshot.org, Compound, etc.)

### Why OpenZeppelin Governor?
- **Battle-tested**: Used by major DAOs
- **Extensible**: Easy to customize
- **Standard**: EIP-712 compliant
- **Upgradeable**: Can add features via extensions

## Scalability Considerations

### Current Limitations
- SQLite (single file, not distributed)
- No caching layer
- No indexing service for blockchain events
- Synchronous vote counting

### Production Improvements
1. **Database**: PostgreSQL with read replicas
2. **Caching**: Redis for vote counts
3. **Indexer**: The Graph or custom indexer for events
4. **Queue**: Bull/BullMQ for async processing
5. **CDN**: For frontend static assets
6. **Load Balancer**: For backend API

## Future Enhancements

### Phase 2
- [ ] Proposal creation UI
- [ ] Vote delegation UI
- [ ] Proposal execution
- [ ] Time-weighted voting
- [ ] Multi-token proposals

### Phase 3
- [ ] Encrypted votes (reveal phase)
- [ ] Quadratic voting
- [ ] Conviction voting
- [ ] NFT-based voting
- [ ] Cross-chain voting

### Phase 4
- [ ] Mobile app
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Governance token rewards
- [ ] Proposal templates
