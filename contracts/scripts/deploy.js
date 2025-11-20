const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner();

    console.log("Deploying contracts with the account:", await signer.getAddress());

    // Read artifacts
    const tokenArtifactPath = path.join(__dirname, "../artifacts/contracts/VotingToken.sol/VotingToken.json");
    const tokenArtifact = JSON.parse(fs.readFileSync(tokenArtifactPath, "utf8"));
    const VotingToken = new ethers.ContractFactory(tokenArtifact.abi, tokenArtifact.bytecode, signer);
    const token = await VotingToken.deploy("VotingToken", "VTK");
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();

    console.log("VotingToken deployed to:", tokenAddress);

    const governorArtifactPath = path.join(__dirname, "../artifacts/contracts/VotingGovernor.sol/VotingGovernor.json");
    const governorArtifact = JSON.parse(fs.readFileSync(governorArtifactPath, "utf8"));
    const VotingGovernor = new ethers.ContractFactory(governorArtifact.abi, governorArtifact.bytecode, signer);
    const governor = await VotingGovernor.deploy(tokenAddress);
    await governor.waitForDeployment();
    const governorAddress = await governor.getAddress();

    console.log("VotingGovernor deployed to:", governorAddress);

    // Mint tokens
    await token.mint(await signer.getAddress(), ethers.parseEther("10000"));
    await token.delegate(await signer.getAddress());
    console.log("Minted 10000 tokens to deployer and delegated");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
