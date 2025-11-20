// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract VotingGovernor is Governor, GovernorSettings, GovernorVotes {
    constructor(IVotes _token)
        Governor("VotingGovernor")
        GovernorSettings(0, 1 weeks, 0) // 0 block delay, 1 week period, 0 threshold
        GovernorVotes(_token)
    {}

    mapping(uint256 => mapping(address => bool)) private _hasVotedTracker;

    // Custom function to vote without choice - simplified for off-chain proposals
    function registerVote(uint256 proposalId) public returns (uint256) {
        require(!_hasVotedTracker[proposalId][msg.sender], "VotingGovernor: vote already cast");
        
        // Get voting weight at current block
        uint256 weight = token().getVotes(msg.sender);
        require(weight > 0, "VotingGovernor: no voting power");
        
        // Mark as voted
        _hasVotedTracker[proposalId][msg.sender] = true;
        
        return weight;
    }

    function hasVoted(uint256 proposalId, address account) public view override returns (bool) {
        return _hasVotedTracker[proposalId][account];
    }

    // Override _countVote to do nothing (off-chain counting)
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight, bytes memory params)
        internal
        override
        returns (uint256)
    {
        require(!_hasVotedTracker[proposalId][account], "VotingGovernor: vote already cast");
        _hasVotedTracker[proposalId][account] = true;
        return weight;
    }

    // Quorum is not enforced on-chain
    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 0;
    }

    // Helper functions as requested
    function getSnapshotBlock(uint256 proposalId) public view returns (uint256) {
        return proposalSnapshot(proposalId);
    }

    function getTotalSupplyAt(uint256 snapshotBlock) public view returns (uint256) {
        return token().getPastTotalSupply(snapshotBlock);
    }

    function getBalanceAt(address holder, uint256 snapshotBlock) public view returns (uint256) {
        return token().getPastVotes(holder, snapshotBlock);
    }

    // Overrides required by Solidity
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _quorumReached(uint256 proposalId) internal view override returns (bool) {
        return false;
    }

    function _voteSucceeded(uint256 proposalId) internal view override returns (bool) {
        return false;
    }

    function COUNTING_MODE() public pure override returns (string memory) {
        return "support=off-chain";
    }
}
