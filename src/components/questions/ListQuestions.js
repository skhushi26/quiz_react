import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../contexts/appContext";
import { Card, Form, Row, Col, Button, Container } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

import Service from "../../utils/Service";
import {
  showConfirmation,
  showSuccess,
  showInfo,
  showError,
} from "../../utils/AlertService";

const ListQuestions = (props) => {
  const { userDetail, showLoader } = useContext(AppContext);
  const { categoryId } = useParams();
  const [questionsData, setQuestionsData] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const que = {
    question_name: "",
    options: [{ title: "", is_correct: true }],
    category_id: "",
  };

  const handleDeleteQuestion = async (queIdx, _id) => {
    if (_id) {
      if (await showConfirmation("Are you sure you want to delete?")) {
        const res = await Service(
          "PATCH",
          `http://localhost:5555/question/delete/${_id}`,
          {},
          {},
          userDetail.token
        );
        const { message, status } = res;

        if (status === 200) {
          showSuccess(message);
          questionsData.questions.splice(queIdx, 1);
          setQuestionsData({ ...questionsData });
        } else if (status === 400) {
          showInfo(message);
        } else {
          showError(message);
        }
      }
    } else {
      questionsData.questions.splice(queIdx, 1);
      setQuestionsData({ ...questionsData });
    }
  };

  const addNewQue = () => {
    const newQue = {
      ...JSON.parse(JSON.stringify(que)),
      category_id: categoryId,
    };

    questionsData.questions = [...questionsData.questions, newQue];
    setQuestionsData({ ...questionsData });
  };

  const addNewOption = (i) => {
    let newOption;
    que.options.forEach((option) => {
      newOption = {
        ...JSON.parse(JSON.stringify({ ...option, is_correct: false })),
      };
      if (questionsData.questions[i].options.length < 4) {
        questionsData.questions[i].options = [
          ...questionsData.questions[i].options,
          newOption,
        ];
      }
    });
    setQuestionsData({ ...questionsData });
  };

  const removeOptions = (queIdx, ansIdx) => {
    if (questionsData.questions[queIdx].options[ansIdx].is_correct) {
      questionsData.questions[queIdx].options[0].is_correct = true;
    }
    questionsData.questions[queIdx].options.splice(ansIdx, 1);

    setQuestionsData({ ...questionsData });
  };

  const handleQuestionTitle = (queIdx, quesTitle) => {
    questionsData.questions[queIdx].question_name = quesTitle;
    setQuestionsData({ ...questionsData });
  };

  const handleIsCorrect = (queIdx, ansIdx, isCorrect) => {
    questionsData.questions[queIdx].options.map((ans, idx) => {
      if (idx === ansIdx) {
        ans.is_correct = isCorrect;
      } else {
        ans.is_correct = false;
      }
    });
    setQuestionsData({ ...questionsData });
  };

  const handleOptionTitle = (queIdx, ansIdx, ansTitle) => {
    questionsData.questions[queIdx].options[ansIdx].title = ansTitle;
    setQuestionsData({ ...questionsData });
  };

  const handleSubmit = async (isSubmitted) => {
    showLoader(true);
    const reqBody = {
      questions: questionsData.questions,
      is_submitted: isSubmitted,
    };
    const res = await Service(
      "POST",
      `http://localhost:5555/question/add-new`,
      reqBody,
      {},
      userDetail.token
    );

    const { message, status } = res;

    if (status === 200) {
      showSuccess(message);
      showLoader(false);
      getQuestionsList();
    } else if (status === 400) {
      showInfo(message);
    } else {
      showError(message);
    }
  };

  const getQuestionsList = async () => {
    const res = await Service(
      "GET",
      `http://localhost:5555/quiz-category/get-question-by-category/${categoryId}`,
      {},
      {},
      userDetail.token
    );
    if (res.data) {
      const isSubmittedFlag = res.data[0].questions.find(
        (que) => que.status === "submitted"
      );
      setIsSubmitted(isSubmittedFlag);
      setQuestionsData(res.data[0]);
    }
  };

  useEffect(() => {
    getQuestionsList();
  }, [categoryId]);

  if (!questionsData) return <span>Loading...</span>;

  return (
    <Container>
      <h3>{questionsData.name}</h3>
      <p>{questionsData.description}</p>

      <hr />
      <Row>
        {questionsData.questions.map((que, queIdx) => {
          return (
            <Form className="list-question-part mb-3">
              <Row className="mb-3">
                <Form.Group controlId="validationCustom01">
                  <Form.Label>Question:</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="10" controlId="validationCustom01">
                  <Form.Control
                    required
                    type="text"
                    className="list-question-text-box"
                    value={que.question_name}
                    onChange={(e) =>
                      handleQuestionTitle(queIdx, e.target.value)
                    }
                    placeholder="Question name"
                    disabled={isSubmitted}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    Please provide question name.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="validationCustom01">
                  <FaTrash
                    title="Delete"
                    className="delete-btn"
                    onClick={() => handleDeleteQuestion(queIdx, que._id)}
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Options:</Form.Label>
              </Form.Group>
              {que.options.map((option, ansIdx) => {
                return (
                  <Row className="mb-1">
                    <Form.Group as={Col} md="8" controlId="validationCustom01">
                      <Form.Control
                        required
                        type="text"
                        className="w-100 list-question-text-box"
                        value={option.title}
                        onChange={(e) =>
                          handleOptionTitle(queIdx, ansIdx, e.target.value)
                        }
                        placeholder="Option title"
                        disabled={isSubmitted}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md="2"
                      controlId="validationCustom02"
                      className="d-flex align-items-center"
                    >
                      <Form.Check
                        className="correct-radio-button"
                        type="radio"
                        label="Correct"
                        name="true"
                        checked={option.is_correct || false}
                        onChange={(e) =>
                          handleIsCorrect(queIdx, ansIdx, e.target.checked)
                        }
                        disabled={isSubmitted}
                      />
                    </Form.Group>
                    {ansIdx != 0 && (
                      <Col md={2}>
                        {!isSubmitted && (
                          <FaTrash
                            title="Remove"
                            className="delete-btn"
                            onClick={() => removeOptions(queIdx, ansIdx)}
                          />
                        )}
                      </Col>
                    )}
                  </Row>
                );
              })}
              {!isSubmitted && (
                <Row className="mt-2">
                  <Col md={3}>
                    <Button
                      className="add-que-option-btn"
                      disabled={isSubmitted}
                      onClick={() => addNewOption(queIdx)}
                    >
                      Add new option
                    </Button>
                  </Col>
                </Row>
              )}
            </Form>
          );
        })}
      </Row>
      <Row className="mt-3">
        <Col md={3}>
          <Button
            disabled={isSubmitted}
            onClick={addNewQue}
            className="add-que-option-btn"
          >
            Add another question!
          </Button>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center mt-5">
        {!isSubmitted && (
          <>
            <Col md={4}>
              <Button variant="success" onClick={() => handleSubmit(true)}>
                Save and Submit
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="info" onClick={() => handleSubmit(false)}>
                Save
              </Button>
            </Col>
          </>
        )}

        <Col md={4}>
          <Link to="/list-category">
            <Button variant="secondary">Cancel</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ListQuestions;
