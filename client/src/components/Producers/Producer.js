import React, { useEffect, useState } from 'react';
import {Link, useLocation, useParams, useNavigate} from 'react-router-dom';
import ProducerService from "../../services/ProducerService";
import Spinner from "react-bootstrap/Spinner";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import ProducerForm from "./ProducersForm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import AuthService from "../../services/AuthService";


const Producer = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate('/login');

  const { id } = useParams();
  const [producer, setProducer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    ProducerService.getProducer(id)
      .then(
        (response) => {
          setProducer(response);
          setLoading(false);
        },
        (error) => {
          setError(true);
          setMessage(error.message);
        }
      );
  }, [edit]);

  useEffect(() => {
    setShow(true);
  },[message]);

  useEffect(() => {
    if (location.state) {
      setEdit(location.state.edit);
      setMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDelete = (id) => {
    setLoading(true);
    ProducerService.deleteProducer(id)
      .then(
        (response) => {
          setLoading(false);
          navigate('/producers', { state: { message: "Producer deleted successfully." } });
        },
        (error) => {
          setError(true);
          setMessage(error.message);
        }
      );
  }

  return (
    <div className="col-md-12">
      <div className="card">
        {
          loading &&
          <div className="card-body">
            <Spinner animation="grow" variant="secondary" />
            Loading...
          </div>
        }
        {
          edit &&
          <div className="card-body">
            <ProducerForm producer={producer} />
          </div>
        }
        { producer && !edit &&
          <div>
            <div className="card-header">
              <div className="row">
                <div className="col-md-2 align-self-center">
                  <Link
                    to="/producers"
                    style={{"textDecoration": "none", "color": "black"}}
                    >
                    <FontAwesomeIcon icon={faArrowLeft} size="xl" onClick={() => {
                      window.history.back();
                    }
                    } />
                    <span style={{marginLeft: "0.5em"}}>Back to List</span>
                  </Link>
                </div>
                <div className="col-md-8 align-self-center">
                  <h3>Producer Details</h3>
                </div>
                <div className="col-md-2">
                </div>
              </div>
            </div>
            <div className="card-body">
              <p>Name: <b>{producer.name}</b></p>
              <p>Region: <b>{producer.region}</b></p>
              <button className="btn btn-danger" onClick={() => handleDelete(producer._id)}>Delete</button>
              <button style={{marginLeft: "1em"}} className="btn btn-primary" onClick={() => setEdit(true)}>Edit</button>
            </div>
          </div>
        }
      </div>
      {message && (
        <ToastContainer className="p-3" position="top-end" style={{marginTop: '3em'}}>
          <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header>
              {error ? <strong className="me-auto">Error</strong> : <strong className="me-auto">Success</strong>}
              <small>Now</small>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
  );
}

export default Producer;
