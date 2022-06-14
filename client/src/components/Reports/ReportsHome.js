import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import {Card} from "react-bootstrap";
import AuthService from "../../services/AuthService";

const ReportsHome = () => {
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate('/login');
  currentUser.role !== 'admin' && navigate('/');

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title><h1>Wines Report</h1></Card.Title>
          <Card.Text>
            <h5>
              Access a complete Wines Report with useful information like amount of wines by producers and regions.
              Also you will be able to check the top rated wines
            </h5>
          </Card.Text>
          <Card.Link href="/reports/wines"><span>Wines Report</span></Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ReportsHome;
