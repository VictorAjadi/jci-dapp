import React, { useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}
import { ethers, Provider } from 'ethers';

const contractAddress = "0xf0d727b69382d8e8529a1f481f2a441bac07f2db";
const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_txId",
          "type": "uint256"
        }
      ],
      "name": "approveTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_txId",
          "type": "uint256"
        }
      ],
      "name": "executeTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "proposeTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_txId",
          "type": "uint256"
        }
      ],
      "name": "rejectTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "sendERC20",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "txId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "TransactionApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "txId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "executor",
          "type": "address"
        }
      ],
      "name": "TransactionExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "txId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "TransactionProposed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "txId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rejecter",
          "type": "address"
        }
      ],
      "name": "TransactionRejected",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [],
      "name": "getSigners",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTransactionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isApproved",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isSigner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "signers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "threshold",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transactions",
      "outputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "bool",
          "name": "executed",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "approvalCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
function App() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [importedWallet, setImportedWallet] = useState<ethers.Wallet | null>(null);
  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setWalletAddress(address);
        setContract(new ethers.Contract(contractAddress, contractABI, signer));

        alert(`Connected to ${address}`);
      } catch (error) {
        alert('Failed to connect wallet');
      }
    } else {
      setProvider(ethers.getDefaultProvider())
      alert('MetaMask not detected');
    }
  };
  // Import wallet using private key (Development Only)
  const importWallet = async (privateKey: any) => {
    try {
      const importedSigner = new ethers.Wallet(privateKey, provider || ethers.getDefaultProvider());
      setImportedWallet(importedSigner);
      setWalletAddress(importedSigner.address);
      setContract(new ethers.Contract(contractAddress, contractABI, importedSigner));
      alert(`Imported wallet: ${importedSigner.address}`);
    } catch (error) {
      alert('Invalid private key');
    }
  };

  // Create a new Ethereum Wallet
  const createAccount = () => {
    const newWallet = ethers.Wallet.createRandom();
    alert(`New Wallet Created!\nAddress: ${newWallet.address}\nPrivate Key: ${newWallet.privateKey}\n(Save your private key securely!)`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Ecla Multisig Wallet</h1>
      <button onClick={connectWallet}>Login with MetaMask</button>
      <button onClick={createAccount}>Create New Account</button>
      <div>
        <input type="text" placeholder="Enter Private Key" id="privateKey" />
        <button onClick={() => {
          const privateKeyInput = document.getElementById('privateKey') as HTMLInputElement | null;
          if (privateKeyInput) {
            importWallet(privateKeyInput.value);
          } else {
            alert('Private key input not found');
          }
        }}>Import Account</button>
      </div>
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
    </div>
  );
}

export default App;
