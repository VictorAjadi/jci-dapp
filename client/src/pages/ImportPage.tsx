// src/pages/ImportPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HDNode } from '@ethersproject/hdnode';
import { Card, Form, Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import useImage from '../hooks/useImage';
import styled from 'styled-components';

const CardHeader = styled(Card.Header)`
  background-color: #4a6fa5;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 1.5rem;
`;
const ImportPage = () => {
  const [importInput, setImportInput] = useState('');
   const {logo} = useImage();
  const [importedWallet, setImportedWallet] = useState<ethers.Wallet | null>(null);
  const navigate = useNavigate();

  const handleImportAccount = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let importedWallet;

      if (importInput.split(' ').length === 12) {
        // If 12 words are provided, treat it as a mnemonic
        const hdNode = HDNode.fromMnemonic(importInput);
        importedWallet = new ethers.Wallet(hdNode.privateKey);
      } else {
        // Otherwise, assume it's a private key
        importedWallet = new ethers.Wallet(importInput);
      }
      setImportedWallet(importedWallet);
      const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const account = savedAccounts.find((acc: any) => importInput===acc.privateKey);
      if(!account){
        const newAccount = {
          mnemonic: importInput.split(' ').length === 12 ? importInput : '',
          privateKey: importedWallet.privateKey,
          address: importedWallet.address,
        };
        savedAccounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(savedAccounts));
      }
      
      toast.success('Wallet imported successfully!');
    } catch (error) {
      toast.error('Invalid seed phrase or private key!');
    }
  };

  return (
    <>
    <CardHeader>
        <img src={logo}/><br />
        Import Existing Account
    </CardHeader>
    <Form onSubmit={handleImportAccount} style={{minWidth: '650px'}} className=''>
      <Form.Group>
        <Form.Label>Seed Phrase / Private Key</Form.Label>
        <Form.Control as="textarea" value={importInput} onChange={(e) => setImportInput(e.target.value)} required />
      </Form.Group>
      <Button type="submit" className='w-100 my-2'>Import Wallet</Button>
    </Form>
    </>

  );
};

export default ImportPage;