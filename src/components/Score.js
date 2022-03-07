import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/score.scss";

const Score = (props) => {
  const handlePreview = () => {
    props.setIsSubmitted(false);
    props.setCurrentQuestion(0);
  };
  const { title, preview = true } = props;
  return (
    <Container className="m-50 mt-5">
      <div className="score-div">
        <span className="score-heading">{title}</span>
        <p className="score">{`Total score: ${props.totalScore}`}</p>
      </div>
      <div className="d-flex justify-content-center mt-30">
        {preview && (
          <Button className="button" onClick={handlePreview}>
            Preview
          </Button>
        )}

        <Link to={`/categories`}>
          <Button className="button">Go back to categories</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Score;
