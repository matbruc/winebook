import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProducerService from "../../services/ProducerService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

const ProducersForm = ({ producer }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (producer) {
      setName(producer.name);
      setRegion(producer.region);
    }
  }, [producer]);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!region.trim()) errors.region = "Region is required";
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

    if (producer) {
      ProducerService.updateProducer(producer._id, { name, region })
        .then((response) => {
          setMessage("Producer updated successfully");
          navigate(`/producers/${producer._id}`, { state: { edit: false, message: "Producer updated successfully" } });
        })
        .catch((error) => {
          const resMessage =
            (error.response?.data?.message) || error.message || error.toString();
          setMessage(resMessage);
          setError(true);
        })
        .finally(() => setLoading(false));
    } else {
      ProducerService.createProducer({ name, region })
        .then((response) => {
          setMessage("Producer created successfully");
          navigate("/producers", { state: { message: "Producer created successfully" } });
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
    navigate(`/producers/${producer?._id}` || "/producers");
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h1>{producer ? "Edit Producer" : "Add New Producer"}</h1>
        <Link to="/producers" className="back-link">
          <span className="back-icon">&#8592;</span> Back to Producers
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
          <Form onSubmit={handleSubmit} className="producer-form">
            <div className="form-section">
              <Form.Group>
                <Form.Label>
                  Producer Name <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!formErrors.name}
                  placeholder="e.g., Antinori"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-4">
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

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span> {producer ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  producer ? "Update Producer" : "Add Producer"
                )}
              </button>
              {producer && (
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

export default ProducersForm;
