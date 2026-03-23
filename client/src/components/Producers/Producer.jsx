import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ProducerForm from "./ProducersForm";
import ProducerService from "../../services/ProducerService";
import AuthService from "../../services/AuthService";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const Producer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const { id } = useParams();

  !currentUser && navigate("/login");

  const [producer, setProducer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setShowAlert(true);
  }, [message]);

  useEffect(() => {
    if (location.state) {
      setEdit(location.state.edit);
      setMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (!edit) {
      setLoading(true);
      ProducerService.getProducer(id)
        .then((response) => {
          setProducer(response);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setMessage(error.message);
          setLoading(false);
        });
    }
  }, [edit, id]);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this producer?")) return;
    setLoading(true);
    ProducerService.deleteProducer(id)
      .then((response) => {
        navigate("/producers", { state: { message: "Producer deleted successfully." } });
      })
      .catch((error) => {
        setError(true);
        setMessage(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="producer-detail-page">
      <div className="back-nav">
        <Link to="/producers" className="back-link">
          <span className="back-icon">&#8592;</span> Back to Producers
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
          <p className="loading-text">Loading producer details...</p>
        </div>
      ) : edit ? (
        <div className="form-container">
          <ProducerForm producer={producer} />
        </div>
      ) : producer ? (
        <div className="producer-detail-container">
          <Card className="producer-detail-card">
            <Card.Body>
              <div className="producer-detail-header">
                <div className="producer-detail-title">
                  <div className="producer-detail-icon">&#127759;</div>
                  <h1 className="producer-detail-name">{producer.name}</h1>
                </div>
                <div className="producer-detail-actions">
                  <Button variant="primary" onClick={() => setEdit(true)}>
                    Edit Producer
                  </Button>
                  <Button variant="danger-outline" onClick={() => handleDelete(producer._id)}>
                    Delete
                  </Button>
                </div>
              </div>

              <div className="producer-detail-grid">
                <div className="detail-section">
                  <h3 className="section-title">Region Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Region</span>
                    <span className="detail-value">{producer.region}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">About This Producer</h3>
                  <p className="producer-description">
                    Discover the wines crafted by {producer.name}, a renowned producer
                    based in {producer.region}. Explore their collection and find your
                    next favorite wine.
                  </p>
                  <Link to="/wines" className="discover-link">
                    Explore Their Wines &rarr;
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="error-container">
          <h3>Producer not found</h3>
          <Link to="/producers" className="btn-back">
            Back to Producers
          </Link>
        </div>
      )}
    </div>
  );
};

export default Producer;
