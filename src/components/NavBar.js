import React from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {useAuth0} from "../react-auth0-spa";
import Form from "react-bootstrap/Form";
import logo from "../logo.png";
import NewActivity from "./NewActivity";

const NavBar = props => {

  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const renderLogin = () => {
    return (
        <div>{isAuthenticated ? [
          <NewActivity appendActivity={props.createActivity} key={1234} />,
          <button onClick={() => logout()}>Kirjaudu ulos</button>,
          ] : <button onClick={() => loginWithRedirect({})}>Kirjaudu</button>
        }
        </div>
    )
  };

  return (
      <>
        <Navbar bg="light" expand="lg" sticky="top">
          <Navbar.Brand href="#home">
            <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
            />
            &nbsp;Kymppi
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Form inline>
              <div>
                {
                  renderLogin()
                }
              </div>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </>
  );
};

export default NavBar;
