import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import WinesForm from "./WinesForm";
import WinesService from "../../services/WinesService";
import AuthService from "../../services/AuthService";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const getRatingDescription = (rating) => {
  if (rating <= 25) return { text: "Bad", variant: "danger" };
  if (rating <= 50) return { text: "Average", variant: "warning" };
  if (rating <= 75) return { text: "Good", variant: "info" };
  return { text: "Excellent", variant: "success" };
};

const Wine = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const { id } = useParams();

  !currentUser && navigate("/login");

  const [wine, setWine] = useState(null);
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
      WinesService.getWine(id)
        .then((response) => {
          setWine(response);
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
    if (!confirm("Are you sure you want to delete this wine?")) return;
    setLoading(true);
    WinesService.deleteWine(id)
      .then((response) => {
        navigate("/wines", { state: { message: "Wine deleted successfully" } });
      })
      .catch((error) => {
        setError(true);
        setMessage(error.message);
      })
      .finally(() => setLoading(false));
  };

  const rating = wine ? getRatingDescription(wine.rating) : null;

  return (
    <div className="wine-detail-page">
      <div className="back-nav">
        <Link to="/wines" className="back-link">
          <span className="back-icon">&#8592;</span> Back to Collection
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
          <p className="loading-text">Loading wine details...</p>
        </div>
      ) : edit ? (
        <div className="form-container">
          <WinesForm wine={wine} />
        </div>
      ) : wine ? (
        <div className="wine-detail-container">
          <Card className="wine-detail-card">
            <Card.Body>
              <div className="wine-detail-header">
                <div className="wine-detail-title">
                  <h1 className="wine-detail-name">{wine.name}</h1>
                  {rating && <Badge variant={rating.variant} className="rating-badge">
                    {rating.text}
                  </Badge>}
                </div>
                <div className="wine-detail-actions">
                  <Button variant="primary" onClick={() => setEdit(true)}>
                    Edit Wine
                  </Button>
                  <Button variant="danger-outline" onClick={() => handleDelete(wine._id)}>
                    Delete
                  </Button>
                </div>
              </div>

              <div className="wine-detail-grid">
                <div className="detail-section">
                  <h3 className="section-title">Producer Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name</span>
                    <Link
                      to={`/producers/${wine.producer._id}`}
                      className="detail-link"
                    >
                      {wine.producer.name}
                    </Link>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Region</span>
                    <span className="detail-value">{wine.producer.region}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Wine Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Variety</span>
                    <span className="detail-value">{wine.variety}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Year</span>
                    <span className="detail-value">{wine.year}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Country</span>
                    <span className="detail-value">{wine.country}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Region</span>
                    <span className="detail-value">{wine.region}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Subregion</span>
                    <span className="detail-value">{wine.subregion}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Rating & Review</h3>
                  <div className="rating-section">
                    <div className="rating-circle">
                      <span className="rating-number">{wine.rating}</span>
                      <span className="rating-max">/100</span>
                    </div>
                    <div className="rating-badge-large">
                      {rating.text}
                    </div>
                  </div>
                  <div className="review-section">
                    <h4 className="review-title">Your Review</h4>
                    <p className="review-text">{wine.review}</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="error-container">
          <h3>Wine not found</h3>
          <Link to="/wines" className="btn-back">
            Back to Collection
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wine;
