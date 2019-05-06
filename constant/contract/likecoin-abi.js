/* eslint-disable */
export const LIKE_COIN_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "supply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x047fc9aa"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "lockedBalances",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x0483a7f6"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "mintForCreatorsPool",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x06802613"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x06fdde03"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x095ea7b3"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "signatureOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1087452c"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_sigCheckerAddr",
        "type": "address"
      }
    ],
    "name": "setSignatureChecker",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x11199872"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "allowDelegate",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1693b85d"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x18160ddd"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x23b872dd"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "unlockTime",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x251c1aa3"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x27e235e3"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x313ce567"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "transferAndCall",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x4000aea0"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x42966c68"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_contract",
        "type": "address"
      }
    ],
    "name": "removeTransferAndCallWhitelist",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x4aec6416"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "claimOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x4e71e0c8"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_maxReward",
        "type": "uint256"
      },
      {
        "name": "_claimedReward",
        "type": "uint256"
      },
      {
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "transferDelegated",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x50114925"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "operator",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x570ca735"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowed",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x5c658165"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "freezeSignatureChecker",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x686790e5"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "mintForContributorPool",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x69dd312f"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x70a08231"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "contributorPoolAddr",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x7b146f6f"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_poolAddrs",
        "type": "address[]"
      },
      {
        "name": "_mintLimit",
        "type": "uint256"
      }
    ],
    "name": "registerCreatorsPools",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x8a6c0b26"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "creatorsPoolAddrs",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8b2d4ed1"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8da5cb5b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "creatorsPoolMintQuota",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8fda5c8e"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x95d89b41"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_addrs",
        "type": "address[]"
      },
      {
        "name": "_values",
        "type": "uint256[]"
      }
    ],
    "name": "transferMultiple",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa05fccef"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa9059cbb"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      },
      {
        "name": "_maxReward",
        "type": "uint256"
      },
      {
        "name": "_claimedReward",
        "type": "uint256"
      },
      {
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "transferAndCallDelegated",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xaaf04471"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_operator",
        "type": "address"
      }
    ],
    "name": "setOperator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xb3ab15fb"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "crowdsaleAddr",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xb673a75c"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "transferAndCallWhitelist",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xb77a284c"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferAndLock",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xbd50b3b4"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_contract",
        "type": "address"
      }
    ],
    "name": "addTransferAndCallWhitelist",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xccd15921"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_crowdsaleAddr",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_privateFundUnlockTime",
        "type": "uint256"
      }
    ],
    "name": "registerCrowdsales",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xd15e06a0"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "remaining",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xdd62ed3e"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "contributorPoolMintQuota",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xe2c8a8ad"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_addrs",
        "type": "address[]"
      },
      {
        "name": "_values",
        "type": "uint256[]"
      },
      {
        "name": "_maxReward",
        "type": "uint256"
      },
      {
        "name": "_claimedReward",
        "type": "uint256"
      },
      {
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "transferMultipleDelegated",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xe2d45f7b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "pendingOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xe30c3978"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "signatureCheckerFreezed",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xeb886568"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_allowed",
        "type": "bool"
      }
    ],
    "name": "switchDelegate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xec8861e7"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_contributorPoolAddr",
        "type": "address"
      },
      {
        "name": "_mintLimit",
        "type": "uint256"
      }
    ],
    "name": "registerContributorPool",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xed7510a0"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "signatureChecker",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xefb2bfd3"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf2fde38b"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "usedNonce",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xf90a2f30"
  },
  {
    "inputs": [
      {
        "name": "_initialSupply",
        "type": "uint256"
      },
      {
        "name": "_signatureOwner",
        "type": "address"
      },
      {
        "name": "_sigCheckerAddr",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_addr",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Lock",
    "type": "event",
    "signature": "0x625fed9875dada8643f2418b838ae0bc78d9a148a18eee4ee1979ff0f3f5d427"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_newSignatureChecker",
        "type": "address"
      }
    ],
    "name": "SignatureCheckerChanged",
    "type": "event",
    "signature": "0x5c87e40f07a8d7749fb793f07d399220d984e3a7fbe343857f59e666a3cbdcf8"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event",
    "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event",
    "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event",
    "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  }
];
