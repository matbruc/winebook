import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import ProducerService from "../../services/ProducerService";
import AuthService from "../../services/AuthService";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const ProducersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate("/login");

  const [producers, setProducers] = useState([]);
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
    getProducers();
  }, []);

  const getProducers = () => {
    ProducerService.getProducers()
      .then((response) => {
        setProducers(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setMessage(error.message);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this producer?")) return;
    setLoading(true);
    ProducerService.deleteProducer(id)
      .then((response) => {
        setMessage("Producer deleted successfully.");
        getProducers();
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="producers-page">
      <div className="page-header">
        <h1>Producers</h1>
        <Link to="/producers/add" className="btn-add">
          <span className="btn-icon">+</span> Add Producer
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
          <p className="loading-text">Loading producers...</p>
        </div>
      ) : producers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#127759;</div>
          <h3>No producers yet</h3>
          <p>Add your first producer to the collection</p>
          <Link to="/producers/add" className="btn-add">
            Add Producer
          </Link>
        </div>
      ) : (
        <div className="producers-grid">
          {producers.map((producer) => (
            <Card key={producer._id} className="producer-card">
              <Card.Body>
                <div className="producer-header">
                  <div className="producer-icon">&#127759;</div>
                  <h3 className="producer-name">{producer.name}</h3>
                </div>
                <div className="producer-info">
                  <p className="info-row">
                    <span className="info-label">Region</span>
                    <span className="info-value">{producer.region}</span>
                  </p>
                </div>
                <div className="producer-actions">
                  <Link to={`/producers/${producer._id}`} className="btn-view">
                    View Details
                  </Link>
                  <Button
                    variant="danger-outline"
                    onClick={() => handleDelete(producer._id)}
                    className="btn-delete"
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProducersList;
