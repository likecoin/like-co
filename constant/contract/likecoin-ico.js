/* eslint-disable */
import { IS_TESTNET } from '../index';

export const LIKE_COIN_ICO_ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "coinsPerEth",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x20a168b1"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addr",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "addPrivateFund",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x3bd756b6"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "finalize",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4bb278f3"
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
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferLike",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4fee5360"
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
      "constant": false,
      "inputs": [
        {
          "name": "_newCoinsPerEth",
          "type": "uint256"
        }
      ],
      "name": "changePrice",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xa2b40d19"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "like",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xa523b88a"
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
      "name": "start",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xbe9a6555"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_customerAddrs",
          "type": "address[]"
        }
      ],
      "name": "registerKYC",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xcdf4d6b4"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "kycDone",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xcf5ade27"
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
      "name": "end",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xefbe1c1c"
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
      "inputs": [
        {
          "name": "_likeAddr",
          "type": "address"
        },
        {
          "name": "_start",
          "type": "uint256"
        },
        {
          "name": "_end",
          "type": "uint256"
        },
        {
          "name": "_coinsPerEth",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_newPrice",
          "type": "uint256"
        }
      ],
      "name": "PriceChanged",
      "type": "event",
      "signature": "0xa6dc15bdb68da224c66db4b3838d9a2b205138e8cff6774e57d0af91e196d622"
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
      "name": "AddPrivateFund",
      "type": "event",
      "signature": "0xe6d93a9078ea00dbfdf1a6ed3cdd74c8c6a6a4bad9286912443d8b2fababb781"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "RegisterKYC",
      "type": "event",
      "signature": "0x658cbbc0cf6d4b2797e80e2a7da796923542d51dfbb8a067253873dd7b4e3a59"
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
          "name": "_ethers",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_coins",
          "type": "uint256"
        }
      ],
      "name": "Purchase",
      "type": "event",
      "signature": "0x12cb4648cf3058b17ceeb33e579f8b0bc269fe0843f3900b8e24b6c54871703c"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "LikeTransfer",
      "type": "event",
      "signature": "0x260bf614549892e4a0418294a2538ded291f4c2fef6ba428eb22494f5c906cc3"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Finalize",
      "type": "event",
      "signature": "0xc5454d111913d0c92fa9088b73be5c3fc91d1eb84db52a8a8485154f05d73f2e"
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
    }
  ];

// mainnet address not yet known
export const LIKE_COIN_ICO_ADDRESS = IS_TESTNET ? '0x255b7C0d310143fE653C3E08198409EB78885ef6' : '0x255b7C0d310143fE653C3E08198409EB78885ef6';

