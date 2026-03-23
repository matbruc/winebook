import React, { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">WINEBOOK</h1>
          <p className="hero-subtitle">Discover, Review, Share</p>
          {!currentUser ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Join Now</Link>
              <Link to="/wines" className="btn-secondary">Explore Wines</Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/wines" className="btn-primary">Explore Wines</Link>
              <Link to="/producers" className="btn-secondary">View Producers</Link>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <Container className="info-section">
        {currentUser && (
          <Row className="mb-4">
            <Col>
              <Card className="glass-card">
                <Card.Body className="glass-body">
                  <p className="info-text">
                    Explore our wine collection with detailed information about producers,
                    variety, region, year, and ratings. Add your own wines and share your
                    tasting notes with the community.
                  </p>
                  <div className="info-links">
                    <Link to="/wines" className="info-link">
                      <span className="icon">&#127866;</span> Wines
                    </Link>
                    <Link to="/producers" className="info-link">
                      <span className="icon">&#127759;</span> Producers
                    </Link>
                    <Link to="/reports" className="info-link">
                      <span className="icon">&#128200;</span> Reports
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Features Grid */}
        <Row className="features-row">
          <Col md={4} className="mb-4">
            <div className="feature-card">
              <div className="feature-icon">&#127866;</div>
              <h3>Explore Wines</h3>
              <p>Browse our curated collection of wines from around the world</p>
              <Link to="/wines" className="feature-link">View Wines &rarr;</Link>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="feature-card">
              <div className="feature-icon">&#127759;</div>
              <h3>Discover Producers</h3>
              <p>Learn about winemakers and their craft</p>
              <Link to="/producers" className="feature-link">View Producers &rarr;</Link>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="feature-card">
              <div className="feature-icon">&#9998;</div>
              <h3>Share Your Reviews</h3>
              <p>Add your own wines and rate your favorites</p>
              <Link to="/wines/add" className="feature-link">Add Wine &rarr;</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
