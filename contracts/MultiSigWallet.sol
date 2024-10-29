// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    // Events
    event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event SignatoryAdded(address indexed signatory);
    event SignatoryRemoved(address indexed signatory);
    event ThresholdChanged(uint newThreshold);

    // State variables
    address[] public signatories;
    mapping(address => bool) public isSignatory;
    uint public numConfirmationsRequired;
    uint public transactionDelay; // Time delay in seconds

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
        uint proposedAt;
        mapping(address => bool) isConfirmed;
    }

    Transaction[] public transactions;

    // Modifiers
    modifier onlySignatory() {
        require(isSignatory[msg.sender], "Not a signatory");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!transactions[_txIndex].isConfirmed[msg.sender], "Transaction already confirmed");
        _;
    }

    constructor(address[] memory _signatories, uint _numConfirmationsRequired, uint _transactionDelay) {
        require(_signatories.length > 0, "Signatories required");
        require(
            _numConfirmationsRequired > 0 && _numConfirmationsRequired <= _signatories.length,
            "Invalid number of confirmations"
        );

        for (uint i = 0; i < _signatories.length; i++) {
            address signatory = _signatories[i];
            require(signatory != address(0), "Invalid signatory");
            require(!isSignatory[signatory], "Signatory not unique");

            isSignatory[signatory] = true;
            signatories.push(signatory);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
        transactionDelay = _transactionDelay;
    }

    receive() external payable {}

    function submitTransaction(address _to, uint _value, bytes memory _data)
        public
        onlySignatory
    {
        uint txIndex = transactions.length;

        transactions.push();
        Transaction storage transaction = transactions[txIndex];
        transaction.to = _to;
        transaction.value = _value;
        transaction.data = _data;
        transaction.executed = false;
        transaction.numConfirmations = 0;
        transaction.proposedAt = block.timestamp;

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint _txIndex)
        public
        onlySignatory
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.isConfirmed[msg.sender] = true;
        transaction.numConfirmations += 1;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint _txIndex)
        public
        onlySignatory
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "Not enough confirmations"
        );
        require(
            block.timestamp >= transaction.proposedAt + transactionDelay,
            "Transaction delay not met"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint _txIndex)
        public
        onlySignatory
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(transaction.isConfirmed[msg.sender], "Transaction not confirmed");

        transaction.isConfirmed[msg.sender] = false;
        transaction.numConfirmations -= 1;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function addSignatory(address _newSignatory)
        public
        onlySignatory
    {
        require(_newSignatory != address(0), "Invalid signatory");
        require(!isSignatory[_newSignatory], "Signatory already exists");

        isSignatory[_newSignatory] = true;
        signatories.push(_newSignatory);

        emit SignatoryAdded(_newSignatory);
    }

    function removeSignatory(address _signatory)
        public
        onlySignatory
    {
        require(isSignatory[_signatory], "Not a signatory");
        require(signatories.length - 1 >= numConfirmationsRequired, "Cannot remove signatory: would break required confirmations");

        isSignatory[_signatory] = false;
        
        for (uint i = 0; i < signatories.length; i++) {
            if (signatories[i] == _signatory) {
                signatories[i] = signatories[signatories.length - 1];
                signatories.pop();
                break;
            }
        }

        emit SignatoryRemoved(_signatory);
    }

    function updateThreshold(uint _newThreshold)
        public
        onlySignatory
    {
        require(_newThreshold > 0 && _newThreshold <= signatories.length, "Invalid threshold");
        numConfirmationsRequired = _newThreshold;
        emit ThresholdChanged(_newThreshold);
    }

    // Getter functions
    function getSignatories() public view returns (address[] memory) {
        return signatories;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations,
            uint proposedAt
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations,
            transaction.proposedAt
        );
    }
}