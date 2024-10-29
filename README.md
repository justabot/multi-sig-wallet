# MultiSig Wallet

A decentralized multi-signature wallet implementation with a web interface. This wallet requires multiple signers to approve transactions before they can be executed.

## Features

- Multiple signatories required for transaction approval
- Configurable confirmation threshold
- Time-delay between transaction proposal and execution
- Web interface for easy interaction
- Support for ETH transfers and contract interactions
- Add/remove signatories functionality
- Adjustable confirmation threshold

## Tech Stack

- Solidity (Smart Contracts)
- Hardhat (Development Environment)
- Python/Flask (Backend)
- React/Next.js (Frontend)
- Web3.py (Blockchain Interaction)
- RainbowKit (Wallet Connection)
- Ethers.js (Blockchain Interaction)

## Prerequisites

- Node.js v14+
- Python 3.8+
- MetaMask or compatible Web3 wallet
- Infura API key (or alternative Ethereum node provider)

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/multisig-wallet.git
cd multisig-wallet
```

2. Frontend dependencies
```
npm install
```

3. Backend dependencies
``` bash
pip install -r requirements.txt
```

4. Environment variables
``` bash
env
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_deployment_private_key
```

5. Deploy the contract
``` bash
npx hardhat run scripts/deploy.js --network sepolia
```

6. Run the backend
``` bash
python frontend/app.py
```

7. Run the frontend
``` bash
npm run dev
```

8. Test the contract
``` bash
npx hardhat test
```