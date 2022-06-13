import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import ProducerService from "../../services/ProducerService";
import Button from "react-bootstrap/Button";
import AuthService from "../../services/AuthService";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
}

const ProducersForm = ({ producer }) => {
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate('/login');

  const form = useRef();
  const checkBtn = useRef();

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  }

  const onChangeRegion = (e) => {
    const region = e.target.value;
    setRegion(region);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setSuccessful(false);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      if (producer) {
        ProducerService.updateProducer(producer._id, {name, region})
          .then(
            (response) => {
              setSuccessful(true);
              setLoading(false);
              setMessage("Producer updated successfully");
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
        ProducerService.createProducer({name, region})
          .then((response) => {
              setMessage("Producer created successfully.");
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
              setSuccessful(false);
            }
          )
      }
    }
  }

  const handleCancel = () => {
    navigate("/producers/" + producer._id, {state: {edit: false}});
  }

  useEffect(() => {
    if (producer) {
      setName(producer.name);
      setRegion(producer.region);
    }
  }, [producer]);

  useEffect(() => {
    if (successful) {
      if(producer) {
        navigate("/producers/" + producer._id, {state: {edit: false, message}});
      } else {
        navigate("/producers", { state: { message } });
      }
    }
  },[successful]);

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          {producer ? <h1>Edit Producer</h1> : <h1>Add Producer</h1>}
          <Form onSubmit={handleSubmit} ref={form}>
            <div className="mb-3">
              <label>Name</label>
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
              <label>Region</label>
              <Input
                type="text"
                className="form-control"
                name="region"
                value={region}
                onChange={onChangeRegion}
                validations={[required]}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              { loading && (
                <span className="spinner-border spinner-border-sm"/>
              )}
              {producer ? "Update Producer" : "Add Producer"}
            </button>
            {producer &&
              <Button style={{marginLeft: "1em"}} className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </Button>
            }
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ProducersForm;
