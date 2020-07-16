import React from 'react';
import Avatar from 'react-avatar';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from "../react-auth0-spa";
import logo from "../logo.png";
import NewActivity from "./NewActivity";

const NavBar = props => {

  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const renderLogin = () => {
    return (
      <Nav>{isAuthenticated ? [
        <Button onClick={() => props.exportPdf()}>PDF</Button>,
        <NewActivity appendActivity={props.createActivity} key={1234} />,
        <NavDropdown alignRight title={<Avatar name={user.name} size={35} round src={user.picture} />}>
          <NavDropdown.Item onClick={() => logout({ returnTo: window.location.href })}>Kirjaudu ulos</NavDropdown.Item>
        </NavDropdown>,
      ] : [
          <Button onClick={() => props.exportPdf()}>PDF</Button>,
          <Button onClick={() => loginWithRedirect({})}>Kirjaudu</Button>
        ]
      }
      </Nav>
    )
  };

  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
        <Navbar.Brand href="#home">
          <img
            src={logo}
            width="35"
            height="35"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
            &nbsp;Kymppi
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          {
            renderLogin()
          }
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
