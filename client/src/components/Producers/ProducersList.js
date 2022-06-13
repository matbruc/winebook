import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Toast from "react-bootstrap/Toast";
import AuthService from '../../services/AuthService';
import ProducerService from "../../services/ProducerService";
import ToastContainer from "react-bootstrap/ToastContainer";

const AddProducerButton = () => {
  return (
    <Button
      variant="primary"
      as={Link}
      to="/producers/add"
      style={{"marginLeft": "10px"}}
    >
      Add Producer
    </Button>
  )
}

const ProducersList = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate('/login');

  const getProducers = () => {
    ProducerService.getProducers()
      .then(
        (response) => {
          setProducers(response);
          setLoading(false);
        })
      .catch(error => {
        setError(true);
        setMessage(error.message);
        setLoading(false);
      });
  }

  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  },[message]);

  useEffect(() => {
    setLoading(true);
    location.state && location.state.message && setMessage(location.state.message)
    window.history.replaceState({}, document.title);
    getProducers();
  }, []);

  const handleDelete = (id) => {
    setLoading(true);
    setShow(false);
    ProducerService.deleteProducer(id)
      .then(
        (response) => {
          setLoading(false);
          setMessage("Producer deleted successfully.");
          getProducers();
          window.scrollTo(0, 0)
        })
      .catch(error => {
        setMessage(error.message);
        setLoading(false);
      });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>Producers</h4>
              <AddProducerButton />
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Region</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading &&
                          <tr>
                           <td colSpan="3">
                             <Spinner animation="grow" variant="secondary" />
                             Loading...
                           </td>
                          </tr>
                        }
                        {!producers || !producers.length &&
                            <tr>
                              <td colSpan="12">
                                No producers found.
                                <AddProducerButton />
                              </td>
                            </tr>
                        }
                        {producers && producers.map(producer => (
                          <tr key={producer._id}>
                            <td>{producer.name}</td>
                            <td>{producer.region}</td>
                            <td>
                              <Link to={`/producers/${producer._id}`}>
                                <Button variant="primary">View</Button>
                              </Link>
                              <Button
                                style={{marginLeft:"0.5em"}}
                                variant="danger"
                                onClick={() => handleDelete(producer._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
}

export default ProducersList;
