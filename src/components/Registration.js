import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import "../styles/registration.scss";
import Service from "../utils/Service";
import { showSuccess, showInfo, showError } from "../utils/AlertService";
import { AppContext } from "../contexts/appContext";

function Registration() {
  const { isAuth, userRole, showLoader } = useContext(AppContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNo, setMobileNo] = useState(0);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isAuth) {
      if (userRole === "admin") {
        navigate("/list-category");
      } else {
        navigate("/categories");
      }
    }
  }, [isAuth]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    showLoader(true);
    const form = event.currentTarget;
    if (form.checkValidity()) {
      const reqBody = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        mobile_no: mobileNo,
      };
      const res = await Service(
        "POST",
        "http://localhost:5555/user/registration",
        reqBody
      );
      const { message, status } = res;

      if (status === 200) {
        showSuccess(message);
        navigate("/login");
      } else if (status === 400) {
        showInfo(message);
      } else {
        showError(message);
      }
    }
    showLoader(false);
    setValidated(true);
  };

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="mt-5"
      >
        <Card style={{ width: "40rem" }} className="main-body">
          <Card.Header className="header-text">Register Yourself</Card.Header>
          <Card.Body>
            <Card.Text>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label className="field-label">First Name</Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Control
                      className="field-text-box"
                      required
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please provide first name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label className="field-label">Last Name</Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Control
                      className="field-text-box"
                      required
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please provide last name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label className="field-label">Email</Form.Label>
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
                    <Form.Label className="field-label">Password</Form.Label>
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
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label className="field-label">Mobile No</Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Control
                      className="field-text-box"
                      required
                      type="number"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      placeholder="Mobile No."
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please provide mobile no.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Button type="submit" className="submit-btn">
                  Submit form
                </Button>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Registration;
