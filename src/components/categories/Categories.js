import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { AppContext } from "../../contexts/appContext";
import Service from "../../utils/Service";
import { APP_URL } from "../../utils/Constants";

const Categories = () => {
  const { userDetail, showLoader } = useContext(AppContext);
  const [categories, setCategories] = useState([]);

  const getCategoryList = async () => {
    showLoader(true);
    const res = await Service(
      "GET",
      `${APP_URL}quiz-category/get-submitted`,
      {},
      {},
      userDetail.token
    );
    if (!res.error) {
      setCategories(res.data);
    }

    showLoader(false);
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <Container>
      <h3 className="mb-4 quiz-category-header">Quiz Categories</h3>
      <Row>
        {categories.map((category) => {
          return (
            <Col md={4} className="card-main">
              <Card style={{ width: "18rem" }} className="mb-3 category">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text>{category.description}</Card.Text>
                  <Card.Text>
                    {category.is_quiz_given ? (
                      <Link to={"/question/" + category._id}>
                        <Button
                          className="score-preview-button"
                          title="Click here to preview your quiz"
                        >
                          {`Total Score: ${category.total_score}`}
                        </Button>
                      </Link>
                    ) : (
                      <Link to={"/question/" + category._id}>
                        <Button className="start-button">Start</Button>
                      </Link>
                    )}
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
