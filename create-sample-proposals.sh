#!/bin/bash

# Script to create sample proposals
# Usage: ./create-sample-proposals.sh [governor_address] [token_address]

GOVERNOR_ADDRESS=${1:-"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"}
TOKEN_ADDRESS=${2:-"0x5FbDB2315678afecb367f032d93F642f64180aa3"}

echo "Creating sample proposals..."
echo "Governor: $GOVERNOR_ADDRESS"
echo "Token: $TOKEN_ADDRESS"
echo ""

# Proposal 1
echo "Creating Proposal 1..."
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -s \
  -d "{
    \"title\": \"Should we increase the treasury allocation?\",
    \"description\": \"This proposal suggests increasing the treasury allocation from 10% to 15% to fund more community initiatives.\",
    \"hash\": \"1\",
    \"contract_address\": \"$GOVERNOR_ADDRESS\",
    \"token_address\": \"$TOKEN_ADDRESS\",
    \"expiration\": \"2025-12-31T23:59:59Z\",
    \"snapshot_block\": \"1\"
  }" | jq .

echo ""

# Proposal 2
echo "Creating Proposal 2..."
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -s \
  -d "{
    \"title\": \"Implement new governance features\",
    \"description\": \"Should we implement quadratic voting and time-locked proposals for better governance?\",
    \"hash\": \"2\",
    \"contract_address\": \"$GOVERNOR_ADDRESS\",
    \"token_address\": \"$TOKEN_ADDRESS\",
    \"expiration\": \"2025-12-31T23:59:59Z\",
    \"snapshot_block\": \"1\"
  }" | jq .

echo ""

# Proposal 3
echo "Creating Proposal 3..."
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -s \
  -d "{
    \"title\": \"Update tokenomics model\",
    \"description\": \"Proposal to adjust the token distribution and introduce staking rewards.\",
    \"hash\": \"3\",
    \"contract_address\": \"$GOVERNOR_ADDRESS\",
    \"token_address\": \"$TOKEN_ADDRESS\",
    \"expiration\": \"2025-12-31T23:59:59Z\",
    \"snapshot_block\": \"1\"
  }" | jq .

echo ""
echo "✅ Sample proposals created!"
echo "View them at: http://localhost:5173"
