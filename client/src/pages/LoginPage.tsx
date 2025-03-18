// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import useImage from '../hooks/useImage';

const CardHeader = styled(Card.Header)`
  background-color: #4a6fa5;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 1.5rem;
`;

const LoginPage = () => {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const account = savedAccounts.find((acc: any) => acc.accountName === accountName && acc.password === password);
    
    if (account) {
      localStorage.setItem('authUser', JSON.stringify(account));
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials!');
    }
  };
  const {logo} = useImage()
  return (
    <>
    <CardHeader>
        <img src={logo}/><br />
        Authentication Required
    </CardHeader>
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>Account Name</Form.Label>
        <Form.Control type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Form.Group>
      <br />
        <Button variant="primary" type="submit" className="w-100 mb-3">
            Unlock
        </Button>
    </Form>
    <Button variant="primary" type="button" className="w-100 mb-3 text-center text-light">
    <Link 
        to='/signup'
        className='text-light'
    >
     Create New Account
    </Link>   
 </Button>

    </>

  );
};

export default LoginPage;