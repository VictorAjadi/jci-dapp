import React from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const AccountDropdown: React.FC = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('authUser');
        navigate('/login');
    };
  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Account Options
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/signup">Add New Account</Dropdown.Item>
        <Dropdown.Item href="/import">Import Account</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#" className="text-light w-auto text-center bg-danger m-2 rounded shadow" onClick={logout}>
            Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AccountDropdown;
