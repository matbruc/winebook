import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import WinesService from "../../services/WinesService";
import AuthService from "../../services/AuthService";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const getRatingDescription = (rating) => {
  if (rating <= 25) return { text: "Bad", variant: "danger" };
  if (rating <= 50) return { text: "Average", variant: "warning" };
  if (rating <= 75) return { text: "Good", variant: "info" };
  return { text: "Excellent", variant: "success" };
};

const WinesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate("/login");

  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(true);
  }, [message]);

  useEffect(() => {
    setLoading(true);
    if (location.state?.message) {
      setMessage(location.state.message);
    }
    window.history.replaceState({}, document.title);
    getWines();
  }, []);

  const getWines = () => {
    WinesService.getWines()
      .then((response) => {
        setWines(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setMessage(error.message);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this wine?")) return;
    setLoading(true);
    WinesService.deleteWine(id)
      .then((response) => {
        setMessage("Wine deleted successfully.");
        getWines();
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="wines-page">
      <div className="page-header">
        <h1>Wine Collection</h1>
        <Link to="/wines/add" className="btn-add">
          <span className="btn-icon">+</span> Add Wine
        </Link>
      </div>

      {showAlert && (
        <Alert
          variant={error ? "danger" : "success"}
          onClose={() => setShowAlert(false)}
          dismissible
          className="mb-4"
        >
          {message}
        </Alert>
      )}

      {loading ? (
        <div className="loading-container">
          <Spinner animation="grow" variant="primary" size="lg" />
          <p className="loading-text">Loading wines...</p>
        </div>
      ) : wines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#127866;</div>
          <h3>No wines yet</h3>
          <p>Add your first wine to the collection</p>
          <Link to="/wines/add" className="btn-add">
            Add Wine
          </Link>
        </div>
      ) : (
        <div className="wines-grid">
          {wines.map((wine) => {
            const rating = getRatingDescription(wine.rating);
            return (
              <Card key={wine._id} className="wine-card">
                <Card.Body>
                  <div className="wine-header">
                    <h3 className="wine-name">{wine.name}</h3>
                    <Badge variant={rating.variant}>{rating.text}</Badge>
                  </div>
                  <div className="wine-info">
                    <p className="info-row">
                      <span className="info-label">Producer</span>
                      <Link
                        to={`/producers/${wine.producer._id}`}
                        className="info-link"
                      >
                        {wine.producer.name}
                      </Link>
                    </p>
                    <p className="info-row">
                      <span className="info-label">Variety</span>
                      <span className="info-value">{wine.variety}</span>
                    </p>
                    <p className="info-row">
                      <span className="info-label">Year</span>
                      <span className="info-value">{wine.year}</span>
                    </p>
                    <p className="info-row">
                      <span className="info-label">Region</span>
                      <span className="info-value">{wine.region}, {wine.country}</span>
                    </p>
                    <p className="info-row wine-rating">
                      <span className="info-label">Rating</span>
                      <span className="rating-value">{wine.rating}/100</span>
                    </p>
                  </div>
                  <div className="wine-actions">
                    <Link to={`/wines/${wine._id}`} className="btn-view">
                      View Details
                    </Link>
                    <Button
                      variant="danger-outline"
                      onClick={() => handleDelete(wine._id)}
                      className="btn-delete"
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WinesList;
