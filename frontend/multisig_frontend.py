from web3 import Web3
from eth_account import Account
import json

class MultiSigWalletFrontend:
    def __init__(self, contract_address, contract_abi):
        # Initialize Web3 (you might want to use your own provider URL)
        self.w3 = Web3(Web3.HTTPProvider('https://sepolia.infura.io/v3/f4f8745e5a334e5aba8777a8f2c3ea78'))
        self.contract = self.w3.eth.contract(address=contract_address, abi=contract_abi)
        self.account = None

    def connect_wallet(self, private_key):
        """Connect wallet using private key"""
        self.account = Account.from_key(private_key)
        return self.account.address

    def submit_transaction(self, to_address, value, data):
        """Submit a transaction to the MultiSig wallet"""
        if not self.account:
            raise Exception("Wallet not connected")

        # Build the transaction
        tx = self.contract.functions.submitTransaction(
            to_address,
            value,
            data
        ).build_transaction({
            'from': self.account.address,
            'gas': 2000000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
        })

        # Sign and send the transaction
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Wait for transaction receipt
        return self.w3.eth.wait_for_transaction_receipt(tx_hash)
    
    def confirm_transaction(self, tx_index):
        """Confirm a pending transaction"""
        tx = self.contract.functions.confirmTransaction(
            tx_index
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 2000000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return self.w3.eth.wait_for_transaction_receipt(tx_hash)
    
    def get_transaction(self, tx_index):
        """Get transaction details"""
        return self.contract.functions.transactions(tx_index).call()
    
    def get_confirmation_count(self, tx_index):
        """Get number of confirmations for a transaction"""
        return self.contract.functions.getConfirmationCount(tx_index).call()
    
    def is_confirmed(self, tx_index, owner):
        """Check if an owner has confirmed a transaction"""
        return self.contract.functions.isConfirmed(tx_index, owner).call()

# Example usage
if __name__ == "__main__":
    # Replace these with your actual values
    CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"
    CONTRACT_ABI = [] # Your contract ABI here
    PRIVATE_KEY = "YOUR_PRIVATE_KEY"
    
    frontend = MultiSigWalletFrontend(CONTRACT_ADDRESS, CONTRACT_ABI)
    
    # Connect wallet
    address = frontend.connect_wallet(PRIVATE_KEY)
    print(f"Connected wallet: {address}")
    
    # Example: Submit a transaction
    to_address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    value = Web3.to_wei(0.1, 'ether')
    data = b''
    
    receipt = frontend.submit_transaction(to_address, value, data)
    print(f"Transaction submitted: {receipt.transactionHash.hex()}") 