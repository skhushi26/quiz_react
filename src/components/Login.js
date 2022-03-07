import React, { useState, useContext } from "react";
import { Form, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../styles/login.scss";
import Service from "../utils/Service";
import { AppContext } from "../contexts/appContext";
import { showSuccess, showInfo, showError } from "../utils/AlertService";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity()) {
      const reqBody = {
        email: email,
        password: password,
      };
      const res = await Service(
        "POST",
        "http://localhost:5555/user/login",
        reqBody
      );
      const { message, status } = res;

      if (status === 200) {
        showSuccess(message);
        dispatch({
          type: "LOGIN_SUCCESS",
          userData: res.data,
          token: res.data.authToken,
        });
        // navigate("/list-category");
      } else if (status === 400) {
        showInfo(message);
      } else {
        showError(message);
      }

      //   event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="mt-5"
      >
        <Card border="primary" style={{ width: "40rem" }}>
          <Card.Header className="header-text">LogIn</Card.Header>
          <Card.Body>
            <Card.Text>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Email</Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Control
                      className="field-text-box"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please provide valid email.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Password</Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Control
                      className="field-text-box"
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please provide password.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Button type="submit" className="submit-btn">
                  Login
                </Button>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="content mt-3">
        <h6>
          Not Yet Registered? <Link to="/signup">Register Now</Link>
        </h6>
      </div>
    </>
  );
};

export default Login;
