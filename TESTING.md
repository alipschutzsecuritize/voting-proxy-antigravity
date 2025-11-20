## Quick Test Guide

### Test the Complete Flow

1. **Access the Application**
   - Open http://localhost:5173 in your browser
   - You should see the home page with available tokens

2. **Connect Your Wallet**
   - Click the "Connect Wallet" button in the header
   - Select MetaMask
   - Connect to localhost network (Chain ID: 31337)
   - Import one of the test accounts from Hardhat node

3. **View Proposals**
   - Click "View Proposals" on the token card
   - You should see the sample proposal: "Should we increase the treasury allocation?"

4. **Vote on a Proposal**
   - Click "View Details" on the proposal
   - Choose Yes, No, or Abstain
   - Approve the transaction in MetaMask
   - Wait for confirmation
   - You should see "Vote registered successfully!"

5. **View Results**
   - After voting, you'll see the results section update
   - The "Cast your vote" section will be replaced with "You have already voted"

### Create Additional Proposals

Use curl or Postman to create more proposals:

```bash
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature Proposal",
    "description": "Should we implement feature X?",
    "hash": "2",
    "contract_address": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "token_address": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "expiration": "2025-12-31T23:59:59Z",
    "snapshot_block": "1"
  }'
```

### Troubleshooting

**MetaMask shows wrong network:**
- Add localhost network manually:
  - Network Name: Localhost 8545
  - RPC URL: http://127.0.0.1:8545
  - Chain ID: 31337
  - Currency Symbol: ETH

**Transaction fails:**
- Make sure Hardhat node is running
- Check that you're using an account with ETH
- Verify contract addresses match deployed contracts

**No proposals showing:**
- Check backend is running on port 3000
- Verify the sample proposal was created successfully
- Check browser console for errors

**Already voted error:**
- Each wallet can only vote once per proposal
- Try with a different test account
- Or create a new proposal

### Test Accounts

Hardhat provides 20 test accounts, each with 10,000 ETH. The first account is:
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

Import this into MetaMask to test voting.
