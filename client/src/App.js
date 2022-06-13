import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import {Routes, Route} from "react-router-dom";

import AuthService from "./services/AuthService";

import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ProducersList from "./components/Producers/ProducersList";
import ProducersForm from "./components/Producers/ProducersForm";
import Producer from "./components/Producers/Producer";
import WinesList from "./components/Wines/WinesList";
import WinesForm from "./components/Wines/WinesForm";
import Wine from "./components/Wines/Wine";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import Navbar from "react-bootstrap/Navbar";


function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role.includes('admin'));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    window.location.reload();
  };

  return (
      <div className="App">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">winebook</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              { currentUser ? (
                <div>
                  <Nav className="me-auto">
                    <Nav.Link href="/wines">Wines</Nav.Link>
                    <Nav.Link href="/producers">Producers</Nav.Link>
                    <Nav.Link onClick={logOut}>Logout</Nav.Link>
                  </Nav>
                </div>
              ) : null }
              { currentUser && isAdmin ? (
                <NavDropdown className="me-auto" title="Admin" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/reports">Reports</NavDropdown.Item>
                </NavDropdown>
              ) : null }
              { !currentUser && (
                <Nav>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Sign Up</Nav.Link>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="container mt-3">
          <Routes>
            <Route path={"*"} element={<div>404</div>} />
            <Route path="/" element={<Home/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<SignUp/>} />
            <Route path="/producers" element={<ProducersList />} />
            <Route path="/producers/add" element={<ProducersForm />} />
            <Route path="/producers/:id" element={<Producer />} />
            <Route path="/wines" element={<WinesList />} />
            <Route path="/wines/add" element={<WinesForm />} />
            <Route path="/wines/:id" element={<Wine />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
