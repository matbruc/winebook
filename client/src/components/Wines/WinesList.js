import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Toast from "react-bootstrap/Toast";
import AuthService from '../../services/AuthService';
import WinesService from "../../services/WinesService";
import ToastContainer from "react-bootstrap/ToastContainer";

const AddWineButton = () => {
  return (
    <Button
      variant="primary"
      as={Link}
      to="/wines/add"
      style={{"marginLeft": "10px"}}
    >
      Add Wine
    </Button>
  )
}

const WinesList = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate('/login');

  const getWines = () => {
    WinesService.getWines()
      .then(
        (response) => {
          setWines(response);
          setLoading(false);
        })
      .catch(error => {
        setError(true);
        setMessage(error.message);
        setLoading(false);
      });
  }

  const getRatingDescription = (rating) => {
    return rating <= 25 ? "Bad" : rating <= 50 ? "Average" : rating <= 75 ? "Good" : "Excellent";
  }

  const [wines, setWines] = useState([]);
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
    getWines();
  }, []);

  const handleDelete = (id) => {
    setLoading(true);
    setMessage("");
    WinesService.deleteWine(id)
      .then(
        (response) => {
          setLoading(false);
          setMessage("Wine deleted successfully.");
          getWines();
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
              <h4>Wines</h4>
              <AddWineButton />
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                      <tr>
                        <th>Name</th>
                        <th>Producer</th>
                        <th>Variety</th>
                        <th>Year</th>
                        <th>Rating</th>
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
                      {!wines || !wines.length  &&
                        <tr>
                          <td colSpan="12">
                            No wines found.
                            <AddWineButton />
                          </td>
                        </tr>
                      }
                      {wines && wines.map(wine => (
                        <tr key={wine._id}>
                          <td>{wine.name}</td>
                          <td>
                            <Link to={`/producers/${wine.producer._id}`}>
                            {wine.producer.name}
                            </Link>
                          </td>
                          <td>{wine.variety}</td>
                          <td>{wine.year}</td>
                          <td>{getRatingDescription(wine.rating)}</td>
                          <td>
                            <Link to={`/wines/${wine._id}`}>
                              <Button variant="primary">View</Button>
                            </Link>
                            <Button
                              style={{marginLeft:"0.5em"}}
                              variant="danger"
                              onClick={() => handleDelete(wine._id)}
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

export default WinesList;
