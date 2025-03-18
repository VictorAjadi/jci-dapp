import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

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

const Layout = () => {

  return (
    <AppContainer fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12}>
          <StyledCard className='p-2'>
            <Outlet/>
          </StyledCard>
        </Col>
      </Row>
    </AppContainer>
  );
};

export default Layout