export const MULTISIG_ADDRESS = "0x244D4FB86586F7703991AFB3b45Eab4F137C1163";
export const MULTISIG_ABI = [
  "function submitTransaction(address _to, uint _value, bytes memory _data) public",
  "function confirmTransaction(uint _txIndex) public",
  "function executeTransaction(uint _txIndex) public",
  "function getTransaction(uint _txIndex) public view returns (address to, uint value, bytes memory data, bool executed, uint numConfirmations, uint proposedAt)",
  "function getTransactionCount() public view returns (uint)",
  "function isSignatory(address) public view returns (bool)",
  "function numConfirmationsRequired() public view returns (uint)"
];
