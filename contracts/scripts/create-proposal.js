const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner();

    console.log("Creating proposal with account:", await signer.getAddress());

    const governorAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const governorArtifactPath = path.join(__dirname, "../artifacts/contracts/VotingGovernor.sol/VotingGovernor.json");
    const governorArtifact = JSON.parse(fs.readFileSync(governorArtifactPath, "utf8"));

    const governor = new ethers.Contract(governorAddress, governorArtifact.abi, signer);

    // Proposal parameters
    const targets = [ethers.ZeroAddress];
    const values = [0];
    const calldatas = ["0x"];
    const description = "Should we increase the treasury allocation?";

    console.log("Proposing...");
    const tx = await governor.propose(targets, values, calldatas, description);
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Proposal created! Block:", receipt.blockNumber);

    // Calculate proposalId manually
    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(description));
    const encoder = ethers.AbiCoder.defaultAbiCoder();
    const encodedProposal = encoder.encode(
        ['address[]', 'uint256[]', 'bytes[]', 'bytes32'],
        [targets, values, calldatas, descriptionHash]
    );
    const proposalId = ethers.keccak256(encodedProposal);

    console.log("\n=== PROPOSAL INFO ===");
    console.log("Proposal ID (calculated):", proposalId);
    console.log("Proposal ID (BigInt):", BigInt(proposalId).toString());

    // Try to get state
    try {
        const state = await governor.state(proposalId);
        const stateNames = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
        console.log("Proposal state:", stateNames[state]);

        const snapshotBlock = await governor.proposalSnapshot(proposalId);
        console.log("Snapshot block:", snapshotBlock.toString());

        console.log("\n✅ Proposal created successfully!");
        console.log("📝 Use this Proposal ID in your database:", BigInt(proposalId).toString());
    } catch (error) {
        console.log("❌ Error checking proposal:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
