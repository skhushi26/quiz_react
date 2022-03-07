import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { AppContext } from "../../contexts/appContext";
import Service from "../../utils/Service";

const Categories = () => {
  const { userDetail } = useContext(AppContext);
  const [categories, setCategories] = useState([]);

  const getCategoryList = async () => {
    const res = await Service(
      "GET",
      "http://localhost:5555/quiz-category/get-submitted",
      {},
      {},
      userDetail.token
    );
    setCategories(res.data);
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <Container>
      <h3 className="mb-3">Quiz Categories</h3>
      <Row>
        {categories.map((category) => {
          return (
            <Col md={4}>
              <Card style={{ width: "18rem" }} className="mb-3">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text>{category.description}</Card.Text>
                  <Card.Text>
                    <Link to={"/question/" + category._id}>
                      <Button variant="success">Start</Button>
                    </Link>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Categories;
