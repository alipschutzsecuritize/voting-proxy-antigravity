const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    const governorAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const governorArtifactPath = path.join(__dirname, "../artifacts/contracts/VotingGovernor.sol/VotingGovernor.json");
    const governorArtifact = JSON.parse(fs.readFileSync(governorArtifactPath, "utf8"));

    const governor = new ethers.Contract(governorAddress, governorArtifact.abi, provider);

    // Check proposal with ID 1
    try {
        const proposalId = 1;
        const state = await governor.state(proposalId);
        const stateNames = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
        console.log(`Proposal ${proposalId} state:`, stateNames[state]);
    } catch (error) {
        console.log("Proposal 1 does not exist:", error.message);
    }

    // Check proposal with ID 2
    try {
        const proposalId = 2;
        const state = await governor.state(proposalId);
        const stateNames = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
        console.log(`Proposal ${proposalId} state:`, stateNames[state]);
    } catch (error) {
        console.log("Proposal 2 does not exist:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
