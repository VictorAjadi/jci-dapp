import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { FaLock, FaUserPlus, FaFileImport, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { TextValidator } from '../utils/textValidator';
import { ethers } from 'ethers';
import { HDNode } from '@ethersproject/hdnode';

// Styled components
const AppContainer = styled(Container)`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 650px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: none;
`;

const CardHeader = styled(Card.Header)`
  background-color: #4a6fa5;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 1.5rem;
`;

const FormContainer = styled.div`
  padding: 2rem;
`;

const IconButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  width: 100%;
`;

const Homepage = () => {
  const [view, setView] = useState<string>('login');
  const [password, setPassword] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [importInput, setImportInput] = useState<string>('');
  const [importedWallet, setImportedWallet] = useState<ethers.Wallet | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName) {
      toast.error('Account name is required!');
      return;
    }
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');

    const account = savedAccounts.find((acc: any) => acc.password === password && accountName===acc.accountName);

    if (account) {
      toast.success(`Successfully logged in as ${account.accountName}!`);
    } else {
      toast.error('Incorrect password!');
    }
  };

  const handleCreateAccount = (e: any) => {
    e.preventDefault();
    const validator = new TextValidator('TEST');

    if (!accountName) {
      toast.error('Account name is required!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    const pwdResult = validator.valPassword(password);
    const cpwdResult = validator.valConfirmPassword(password, confirmPassword);
    const accNameResult = validator.valUsername(accountName);

    if (accNameResult && 'status' in accNameResult && !accNameResult.status) {
      toast.error(accNameResult?.msg);
      return;
    }
    if (pwdResult && 'status' in pwdResult && !pwdResult.status) {
      toast.error(pwdResult?.msg);
      return;
    }

    if (cpwdResult && 'status' in cpwdResult && !cpwdResult.status) {
      toast.error(cpwdResult?.msg);
      return;
    }
    //check if name already exist
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const account = savedAccounts.find((acc: any) => accountName===acc.accountName);
    if(account){
      toast.error(`This ${account.accountName} already exist.`);
      return;
    }
    // Generate Ethereum Wallet
    const newWallet = ethers.Wallet.createRandom();
    const newAccount = {
      accountName,
      password,
      mnemonic: newWallet.mnemonic?.phrase || '',
      privateKey: newWallet.privateKey,
      address: newWallet.address,
    };

    // Save to localStorage
    savedAccounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(savedAccounts));

    setMnemonic(newWallet.mnemonic?.phrase || '');
    setPrivateKey(newWallet.privateKey);
    setWalletAddress(newWallet.address);

    toast.success('New Ethereum wallet created!');
    setView('login');
  };

  const handleImportAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountName) {
      toast.error('Account name is required!');
      return;
    }

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
      const account = savedAccounts.find((acc: any) => privateKey===acc.privateKey);
      if(!account){
        const newAccount = {
          accountName,
          mnemonic: importInput.split(' ').length === 12 ? importInput : '',
          privateKey: importedWallet.privateKey,
          address: importedWallet.address,
        };
        savedAccounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(savedAccounts));
      }
      toast.success('Wallet imported successfully!');
      setView('login');
    } catch (error) {
      toast.error('Invalid seed phrase or private key!');
    }
  };

  const renderLoginView = () => (
    <>
      <CardHeader>
        <FaLock size={24} style={{ marginRight: '10px' }} />
        Authentication Required
      </CardHeader>
      <FormContainer>
        
        <Form onSubmit={handlePasswordSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Account Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter account name" 
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Unlock
          </Button>
        </Form>
        
        <hr />
        
        <div className="d-grid gap-2">
          <IconButton 
            variant="outline-primary" 
            onClick={() => {
              setView('create');
            }}
          >
            <FaUserPlus /> Create New Account
          </IconButton>
          
          <IconButton 
            variant="outline-secondary" 
            onClick={() => {
              setView('import');
              setMnemonic('');
              setPrivateKey('');
              setWalletAddress('');
            }}
          >
            <FaFileImport /> Import Existing Account
          </IconButton>
        </div>
      </FormContainer>
    </>
  );

  const renderCreateAccountView = () => (
    <>
      <CardHeader>
        <FaUserPlus size={24} style={{ marginRight: '10px' }} />
        Create New Account
      </CardHeader>
      <FormContainer>        
        <Form onSubmit={handleCreateAccount}>
        <Form.Group className="mb-3">
            <Form.Label>Account Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter account name" 
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter new password" 
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirm new password" 
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              required
            />
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
          <Button 
            variant="outline-secondary" 
            className="w-100" 
            onClick={() => {
              setView('login');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Login
          </Button>
        </Form>
      </FormContainer>
    </>
  );

  const renderImportAccountView = () => (
    <>
      <CardHeader>
        <FaFileImport size={24} style={{ marginRight: '10px' }} />
        Import Existing Account
      </CardHeader>
      <FormContainer>
      <Form.Group className="mb-3">
          <Form.Label>Account Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter account name" 
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </Form.Group>
        <Form onSubmit={handleImportAccount}>
          <Form.Group className="mb-3">
            <Form.Label>Seed Phrase / Private Key</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your 12-word seed phrase or private key"
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Import Wallet
          </Button>
        </Form>

        {walletAddress && (
          <div>
            <p><strong>Wallet Address:</strong> {walletAddress}</p>
            <p><strong>Seed Phrase:</strong> {mnemonic}</p>
            <p><strong>Private Key:</strong> {privateKey}</p>
          </div>
        )}

        <Button variant="outline-secondary" className="w-100" onClick={() => setView('login')}>
          <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Login
        </Button>
      </FormContainer>
    </>
  );

  return (
    <AppContainer fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={10} lg={12}>
          <StyledCard>
            {view === 'login' && renderLoginView()}
            {view === 'create' && renderCreateAccountView()}
            {view === 'import' && renderImportAccountView()}
          </StyledCard>
        </Col>
      </Row>
    </AppContainer>
  );
};

export default Homepage