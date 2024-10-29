const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const wallet = await MultiSigWallet.deploy(
        [deployer.address], // Initial signatories
        1, // Required confirmations
        86400 // 1 day delay
    );

    await wallet.deployed();
    console.log("MultiSigWallet deployed to:", wallet.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 