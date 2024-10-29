from flask import Flask, render_template, request, jsonify
from multisig_frontend import MultiSigWalletFrontend
from web3 import Web3

app = Flask(__name__)

# Initialize the MultiSig frontend
CONTRACT_ADDRESS = "0x244D4FB86586F7703991AFB3b45Eab4F137C1163"
CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "_to", "type": "address"},
            {"internalType": "uint256", "name": "_value", "type": "uint256"},
            {"internalType": "bytes", "name": "_data", "type": "bytes"}
        ],
        "name": "submitTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_txIndex", "type": "uint256"}],
        "name": "confirmTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_txIndex", "type": "uint256"}],
        "name": "executeTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_txIndex", "type": "uint256"}],
        "name": "getTransaction",
        "outputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "value", "type": "uint256"},
            {"internalType": "bytes", "name": "data", "type": "bytes"},
            {"internalType": "bool", "name": "executed", "type": "bool"},
            {"internalType": "uint256", "name": "numConfirmations", "type": "uint256"},
            {"internalType": "uint256", "name": "proposedAt", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTransactionCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "isSignatory",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "numConfirmationsRequired",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]
frontend = MultiSigWalletFrontend(CONTRACT_ADDRESS, CONTRACT_ABI)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/connect', methods=['POST'])
def connect_wallet():
    private_key = request.json.get('privateKey')
    try:
        address = frontend.connect_wallet(private_key)
        return jsonify({'success': True, 'address': address})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/submit', methods=['POST'])
def submit_transaction():
    data = request.json
    try:
        receipt = frontend.submit_transaction(
            data['toAddress'],
            Web3.to_wei(float(data['value']), 'ether'),
            bytes.fromhex(data['data'].replace('0x', '')) if data['data'] else b''
        )
        return jsonify({
            'success': True,
            'txHash': receipt.transactionHash.hex()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True) 