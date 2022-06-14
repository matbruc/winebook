import React, { useState, useEffect } from "react";
import {Card, Col, Row} from "react-bootstrap";
import AuthService from "../../services/AuthService";
import Container from "react-bootstrap/Container";
import Image from 'react-bootstrap/Image'

const Home = () => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <Container>
      <Card>
        <Image
          src="life-is-too-short-to-drink-bad-winejpgraw1.jpeg"
          style={{ width: '100%'}}
          alt="Wine"
          fluid
        />
      </Card>
      {!currentUser &&
      <Card>
        <Card.Body>
          <Card.Title><h1>winebook</h1></Card.Title>
          <Card.Text>
            <p><span>In order to continue, please login or sign up.</span></p>
          </Card.Text>

          <Card.Link href="/register"><span>Sign Up</span></Card.Link>
          <Card.Link href="/login"><span>Login</span></Card.Link>
        </Card.Body>
      </Card>}
      { currentUser &&
        <Card>
          <Row>
            <Col>
              <h1>winebook</h1>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <span>
                    Check our wines collection, including producer details,
                    variety, region, year and rating. Also, you can add your own
                    wine to the collection.
                  </span>
                </Card.Body>
                <Card.Link href="/wines"><span>Wines</span></Card.Link>
              </Card>
            </Col>
          </Row>
        </Card>}
    </Container>
  );
};

export default Home;
