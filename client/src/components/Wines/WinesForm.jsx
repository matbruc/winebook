import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WinesService from "../../services/WinesService";
import ProducerService from "../../services/ProducerService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Rating } from "react-simple-star-rating";
import Spinner from "react-bootstrap/Spinner";

const WinesForm = ({ wine }) => {
  const navigate = useNavigate();
  const currentUser = null; // AuthService.getCurrentUser();

  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [year, setYear] = useState(0);
  const [producer, setProducer] = useState(null);
  const [producers, setProducers] = useState([]);
  const [region, setRegion] = useState("");
  const [subregion, setSubregion] = useState("");
  const [country, setCountry] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (wine) {
      setName(wine.name);
      setVariety(wine.variety);
      setYear(wine.year);
      setProducer(wine.producer?._id || null);
      setRegion(wine.region);
      setSubregion(wine.subregion);
      setCountry(wine.country);
      setReview(wine.review);
      setRating(wine.rating);
    }
  }, [wine]);

  useEffect(() => {
    setLoading(true);
    ProducerService.getProducers()
      .then((response) => {
        setProducers(response);
        setLoading(false);
      })
      .catch((error) => {
        setMessage(error.message);
        setLoading(false);
      });
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!variety.trim()) errors.variety = "Variety is required";
    if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
      errors.year = "Please enter a valid year";
    }
    if (!producer) errors.producer = "Please select a producer";
    if (!region.trim()) errors.region = "Region is required";
    if (!country.trim()) errors.country = "Country is required";
    if (!review.trim()) errors.review = "Review is required";
    if (rating === 0) errors.rating = "Please provide a rating";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setError(true);
      return;
    }

    setMessage("");
    setError(false);
    setLoading(true);

    if (wine) {
      WinesService.updateWine(wine._id, {
        name,
        variety,
        year,
        producer,
        region,
        subregion,
        country,
        review,
        rating,
      })
        .then((response) => {
          setMessage("Wine updated successfully");
          navigate(`/wines/${wine._id}`, { state: { edit: false, message: "Wine updated successfully" } });
        })
        .catch((error) => {
          const resMessage =
            (error.response?.data?.message) || error.message || error.toString();
          setMessage(resMessage);
          setError(true);
        })
        .finally(() => setLoading(false));
    } else {
      WinesService.createWine({
        name,
        variety,
        year,
        producer,
        region,
        subregion,
        country,
        review,
        rating,
      })
        .then((response) => {
          setMessage("Wine created successfully");
          navigate("/wines", { state: { message: "Wine created successfully" } });
        })
        .catch((error) => {
          const resMessage =
            (error.response?.data?.message) || error.message || error.toString();
          setMessage(resMessage);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCancel = () => {
    navigate(`/wines/${wine?._id}` || "/wines");
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h1>{wine ? "Edit Wine" : "Add New Wine"}</h1>
        <Link to="/wines" className="back-link">
          <span className="back-icon">&#8592;</span> Back to Collection
        </Link>
      </div>

      {message && (
        <div className={`alert-custom ${error ? "alert-error" : "alert-success"}`} role="alert">
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <Spinner animation="grow" variant="primary" size="lg" />
          <p className="loading-text">Loading...</p>
        </div>
      ) : (
        <div className="form-container">
          <Form onSubmit={handleSubmit} className="wine-form">
            <div className="form-row">
              <Form.Group className="form-col">
                <Form.Label>
                  Wine Name <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!formErrors.name}
                  placeholder="e.g., Cabernet Sauvignon Reserve"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-col">
                <Form.Label>
                  Variety <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  isInvalid={!!formErrors.variety}
                  placeholder="e.g., Cabernet Sauvignon"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.variety}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="form-row">
              <Form.Group className="form-col">
                <Form.Label>
                  Year <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 0)}
                  isInvalid={!!formErrors.year}
                  placeholder="e.g., 2018"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.year}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-col">
                <Form.Label>
                  Producer <span className="required">*</span>
                </Form.Label>
                <Form.Select
                  value={producer || ""}
                  onChange={(e) => setProducer(e.target.value)}
                  isInvalid={!!formErrors.producer}
                  className="form-input"
                >
                  <option value="">Select a producer</option>
                  {producers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.producer}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="form-row">
              <Form.Group className="form-col">
                <Form.Label>
                  Country <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  isInvalid={!!formErrors.country}
                  placeholder="e.g., Italy"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.country}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-col">
                <Form.Label>
                  Region <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  isInvalid={!!formErrors.region}
                  placeholder="e.g., Tuscany"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.region}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <Form.Group>
              <Form.Label>Subregion</Form.Label>
              <Form.Control
                type="text"
                value={subregion}
                onChange={(e) => setSubregion(e.target.value)}
                placeholder="e.g., Chianti Classico"
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="form-section">
              <Form.Label>
                Your Review <span className="required">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                isInvalid={!!formErrors.review}
                placeholder="Describe the taste, aroma, and your overall impression..."
                className="form-textarea"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.review}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-section">
              <Form.Label className="d-block">
                Rating <span className="required">*</span>
              </Form.Label>
              <div className="rating-container">
                <Rating
                  onClick={setRating}
                  ratingValue={rating}
                  name="rating"
                  size={40}
                  showTooltip
                  transition
                  fillColor="#8b1e20"
                  emptyColor="#ddd"
                  allowHalfIcon
                  cursor="pointer"
                />
                {rating > 0 && (
                  <span className="rating-text">{rating}/100</span>
                )}
              </div>
              {formErrors.rating && (
                <div className="error-text">{formErrors.rating}</div>
              )}
            </Form.Group>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span> {wine ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  wine ? "Update Wine" : "Add Wine"
                )}
              </button>
              {wine && (
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="btn-cancel"
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default WinesForm;
