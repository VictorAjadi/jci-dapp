// src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const SignupPage = () => {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    const [mnemonic, setMnemonic] = useState<string>('');
    const [privateKey, setPrivateKey] = useState<string>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    if (savedAccounts.some((acc: any) => acc.accountName === accountName)) {
      toast.error('Account already exists!');
      return;
    }

    const newWallet = ethers.Wallet.createRandom();
    const newAccount = { accountName, password, privateKey: newWallet.privateKey, address: newWallet.address };
    savedAccounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(savedAccounts));
    setMnemonic(newWallet.mnemonic?.phrase || '');
    setPrivateKey(newWallet.privateKey);
    setWalletAddress(newWallet.address);
    toast.success('Account created successfully!');
    setTimeout(()=>{
        navigate('/login')
    },5000)
  };
 const {logo} = useImage();
  return (
    <>
    <CardHeader>
        <img src={logo}/><br />
        Create New Account
    </CardHeader>
    <Form onSubmit={handleSignup}>
      <Form.Group>
        <Form.Label>Account Name</Form.Label>
        <Form.Control type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />

      </Form.Group>
          <Button variant="success" type="submit" className="w-100 mb-3">
            Create Account
     </Button>
      {walletAddress && (
          <div>
            <p><strong>Wallet Address:</strong> {walletAddress}</p>
            <p><strong>Seed Phrase:</strong> {mnemonic}</p>
            <p><strong>Private Key:</strong> {privateKey}</p>
          </div>
        )}
    </Form>
    </>
  );
};

export default SignupPage;