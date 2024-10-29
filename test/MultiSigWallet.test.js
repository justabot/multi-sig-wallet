const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
    let MultiSigWallet;
    let wallet;
    let owner1;
    let owner2;
    let owner3;
    let other;

    beforeEach(async function () {
        [owner1, owner2, owner3, other] = await ethers.getSigners();
        
        MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
        wallet = await MultiSigWallet.deploy(
            [owner1.address, owner2.address, owner3.address],
            2, // Required confirmations
            86400 // 1 day delay
        );
        await wallet.deployed();
    });

    describe("Basic functionality", function () {
        it("Should initialize correctly", async function () {
            expect(await wallet.numConfirmationsRequired()).to.equal(2);
            expect(await wallet.isSignatory(owner1.address)).to.be.true;
            expect(await wallet.isSignatory(owner2.address)).to.be.true;
            expect(await wallet.isSignatory(owner3.address)).to.be.true;
        });

        it("Should submit and confirm transaction", async function () {
            const tx = await wallet.submitTransaction(other.address, 100, "0x");
            await tx.wait();

            expect(await wallet.getTransactionCount()).to.equal(1);
            
            await wallet.confirmTransaction(0);
            const transaction = await wallet.getTransaction(0);
            expect(transaction.numConfirmations).to.equal(1);
        });
    });
});
