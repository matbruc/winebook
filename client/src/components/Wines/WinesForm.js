import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import WinesService from "../../services/WinesService";
import Button from "react-bootstrap/Button";
import AuthService from "../../services/AuthService";
import ProducerService from "../../services/ProducerService";
import Textarea from "react-validation/build/textarea";
import { Rating } from 'react-simple-star-rating'

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
}

const WinesForm = ({ wine }) => {
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  !currentUser && navigate('/login');
  const form = useRef();
  const checkBtn = useRef();

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
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  }

  const onChangeVariety = (e) => {
    const variety = e.target.value;
    setVariety(variety);
  }

  const onChangeYear = (e) => {
    const year = e.target.value;
    setYear(year);
  }

  const onChangeProducer = (e) => {
    const producer = e.target.value;
    ProducerService.getProducer(producer)
      .then(
        (response) => {
          setProducer(response);
        }
      )
  }

  const onChangeRegion = (e) => {
    const region = e.target.value;
    setRegion(region);
  }

  const onChangeSubregion = (e) => {
    const subregion = e.target.value;
    setSubregion(subregion);
  }

  const onChangeCountry = (e) => {
    const country = e.target.value;
    setCountry(country);
  }

  const onChangeReview = (e) => {
    const review = e.target.value;
    setReview(review);
  }

  const onChangeRating = (rate) => {
    setRating(rate);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setSuccessful(false);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      if (wine) {
        WinesService.updateWine(wine._id, { name, variety, year, producer, region, subregion, country, review, rating })
          .then(
            (response) => {
              setSuccessful(true);
              setLoading(false);
              setMessage("Wine updated successfully");
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              setMessage(resMessage);
              setSuccessful(false);
              setLoading(false);
            }
          )
      } else {
        WinesService.createWine({name, variety, year, producer, region, subregion, country, review, rating})
          .then((response) => {
              setMessage("Wine created successfully.");
              setSuccessful(true);
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              setMessage(resMessage);
            }
          )
      }
    }
  }

  useEffect(() => {
    if (wine) {
      setName(wine.name);
      setVariety(wine.variety);
      setYear(wine.year);
      setProducer(wine.producer);
      setRegion(wine.region);
      setSubregion(wine.subregion);
      setCountry(wine.country);
      setReview(wine.review);
      setRating(wine.rating);
    }
  }, [wine]);

  useEffect(() => {
    if (successful) {
      if (wine) {
        navigate("/wines/" + wine._id, {state: {edit: false, message}});
      } else {
        navigate("/wines", {state: {message}});
      }
    }
  }, [successful]);

  useEffect(() => {
    setLoading(true);
    ProducerService.getProducers()
      .then(
        (response) => {
          setProducers(response);
          setLoading(false);
        })
      .catch(error => {
        setMessage(error.message);
        setLoading(false);
      });
  }, []);

  const handleCancel = () => {
    navigate("/wines/" + wine._id, {state: {edit: false}});
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          <h1>{wine ? "Edit Wine" : "Add Wine"}</h1>
        </div>
        <Form onSubmit={handleSubmit} ref={form}>
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <Input
              type="text"
              className="form-control"
              name="name"
              value={name}
              onChange={onChangeName}
              validations={[required]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="variety">Variety</label>
            <Input
              type="text"
              className="form-control"
              name="variety"
              value={variety}
              onChange={onChangeVariety}
              validations={[required]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="year">Year</label>
            <Input
              type="number"
              className="form-control"
              name="year"
              value={year}
              onChange={onChangeYear}
              validations={[required]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="producer">Producer</label>
            <p>
              If you don't see the producer you want in the list, please <Link to="/producers/add">add it</Link>
            </p>
            <select
              className="form-control"
              name="producer"
              value={producer ? producer._id : ""}
              data-live-search="true"
              onChange={onChangeProducer}>
              <option value="">Select a producer</option>
              {producers.map(producer => (
                <option key={producer._id} value={producer._id}>{producer.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="region">Region</label>
            <Input
              type="text"
              className="form-control"
              name="region"
              value={region}
              onChange={onChangeRegion}
              validations={[required]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="subregion">Subregion</label>
            <Input
              type="text"
              className="form-control"
              name="subregion"
              value={subregion}
              onChange={onChangeSubregion}
              validations={[required]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="country">Country</label>
            <Input
              type="text"
              className="form-control"
              name="country"
              value={country}
              onChange={onChangeCountry}
              validations={[required]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="review">Review</label>
            <Textarea
              type="text"
              className="form-control"
              name="review"
              value={review}
              onChange={onChangeReview}
              validations={[required]}
            />
          </div>
          <div className="mb-3" style={{marginTop: "2em"}}>
            <div className="row">
              <div className="col-md-2">
                <label htmlFor="rating">Rating</label>
              </div>
              <div className="col-md-10">
                <Rating
                  onClick={onChangeRating}
                  ratingValue={rating}
                  name="rating"
                  size={30}
                  showTooltip
                  transition
                  fillColor='orange'
                  emptyColor='gray'
                  allowHalfIcon
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              {loading && <span>Loading...</span>}
              {wine ? "Update Wine" : "Add Wine"}
            </button>
            {wine && (
              <Button style={{marginLeft: "1em"}} className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{display: "none"}} ref={checkBtn}/>
        </Form>
      </div>
    </div>
  );
}

export default WinesForm;
