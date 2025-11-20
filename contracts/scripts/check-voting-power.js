const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner();

    const userAddress = await signer.getAddress();
    console.log("User address:", userAddress);

    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tokenArtifactPath = path.join(__dirname, "../artifacts/contracts/VotingToken.sol/VotingToken.json");
    const tokenArtifact = JSON.parse(fs.readFileSync(tokenArtifactPath, "utf8"));
    const token = new ethers.Contract(tokenAddress, tokenArtifact.abi, provider);

    const balance = await token.balanceOf(userAddress);
    console.log("Token balance:", ethers.formatEther(balance), "VTK");

    const votes = await token.getVotes(userAddress);
    console.log("Voting power:", ethers.formatEther(votes), "VTK");

    if (votes > 0) {
        console.log("\n✅ User has voting power! Can vote on proposals.");
    } else {
        console.log("\n❌ User needs to delegate tokens to get voting power.");
        console.log("Run: await token.delegate(userAddress)");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
