import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../contexts/appContext";
import { Card, Form, Row, Col, Button, Container } from "react-bootstrap";

import Service from "../../utils/Service";
import {
  showConfirmation,
  showSuccess,
  showInfo,
  showError,
} from "../../utils/AlertService";

const ListQuestions = (props) => {
  const { userDetail } = useContext(AppContext);
  const { categoryId } = useParams();
  const [questionsData, setQuestionsData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const que = {
    question_name: "",
    options: [{ title: "", is_correct: false }],
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
          questionsData[0].questions.splice(queIdx, 1);
          setQuestionsData([...questionsData]);
        } else if (status === 400) {
          showInfo(message);
        } else {
          showError(message);
        }
      }
    } else {
      questionsData[0].questions.splice(queIdx, 1);
      setQuestionsData([...questionsData]);
    }
  };

  const addNewQue = () => {
    const newQue = {
      ...JSON.parse(JSON.stringify(que)),
      category_id: categoryId,
    };

    questionsData[0].questions = [...questionsData[0].questions, newQue];
    setQuestionsData([...questionsData]);
  };

  const addNewOption = (i) => {
    let newOption;
    que.options.forEach((option) => {
      newOption = {
        ...JSON.parse(JSON.stringify(option)),
      };
      if (questionsData[0].questions[i].options.length < 4) {
        questionsData[0].questions[i].options = [
          ...questionsData[0].questions[i].options,
          newOption,
        ];
        // setAddOptionDisable(true);
      }
    });
    setQuestionsData([...questionsData]);
  };

  const removeOptions = (queIdx, ansIdx) => {
    questionsData[0].questions[queIdx].options.splice(ansIdx, 1);
    setQuestionsData([...questionsData]);
  };

  const handleQuestionTitle = (queIdx, quesTitle) => {
    questionsData[0].questions[queIdx].question_name = quesTitle;
    setQuestionsData([...questionsData]);
  };

  const handleIsCorrect = (queIdx, ansIdx, isCorrect) => {
    questionsData[0].questions[queIdx].options.map((ans, idx) => {
      if (idx === ansIdx) {
        ans.is_correct = isCorrect;
      } else {
        ans.is_correct = false;
      }
    });
    setQuestionsData([...questionsData]);
  };

  const handleOptionTitle = (queIdx, ansIdx, ansTitle) => {
    questionsData[0].questions[queIdx].options[ansIdx].title = ansTitle;
    setQuestionsData([...questionsData]);
  };

  const handleSubmit = async (isSubmitted) => {
    // event.preventDefault();
    // const form = event.currentTarget;
    // if (form.checkValidity()) {
    const reqBody = {
      questions: questionsData[0].questions,
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
      getQuestionsList();
    } else if (status === 400) {
      showInfo(message);
    } else {
      showError(message);
    }
    // event.stopPropagation();
    // }

    // setValidated(true);
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
      // setIsSubmitted(false);

      const isSubmittedFlag = res.data[0].questions.find(
        (que) => que.status === "submitted"
      );
      setIsSubmitted(isSubmittedFlag);
      setQuestionsData(res.data);
    }
  };

  useEffect(() => {
    getQuestionsList();
  }, []);

  return (
    <>
      <div>
        {questionsData.map((quiz) => {
          return (
            <Container>
              <h3>{quiz.name}</h3>
              <p>{quiz.description}</p>

              <hr />
              <Row>
                {quiz.questions.map((que, queIdx) => {
                  return (
                    <>
                      <Form
                        className="list-question-part mb-3"
                        // noValidate
                        // validated={validated}
                        // onSubmit={handleSubmit}
                      >
                        <Row className="mb-3">
                          <Form.Group controlId="validationCustom01">
                            <Form.Label>Question:</Form.Label>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md="10"
                            controlId="validationCustom01"
                          >
                            <Form.Control
                              // className="field-text-box"
                              required
                              type="text"
                              value={que.question_name}
                              onChange={(e) =>
                                handleQuestionTitle(queIdx, e.target.value)
                              }
                              placeholder="Question name"
                              disabled={isSubmitted}
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Please provide question name.
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md="2"
                            controlId="validationCustom01"
                          >
                            <Button
                              variant="danger"
                              onClick={() =>
                                handleDeleteQuestion(queIdx, que._id)
                              }
                            >
                              Delete
                            </Button>
                          </Form.Group>
                        </Row>
                        {/* <Row className="mb-3"> */}
                        <Form.Group controlId="validationCustom01">
                          <Form.Label>Options:</Form.Label>
                        </Form.Group>
                        {que.options.map((option, ansIdx) => {
                          return (
                            <Row className="mb-1">
                              <Form.Group
                                as={Col}
                                md="8"
                                controlId="validationCustom01"
                              >
                                <Form.Control
                                  required
                                  type="text"
                                  className="w-100"
                                  value={option.title}
                                  onChange={(e) =>
                                    handleOptionTitle(
                                      queIdx,
                                      ansIdx,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Option title"
                                  disabled={isSubmitted}
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="2"
                                controlId="validationCustom02"
                                className="d-flex align-items-center"
                              >
                                <Form.Check
                                  type="radio"
                                  label="True"
                                  name="true"
                                  checked={option.is_correct || false}
                                  onChange={(e) =>
                                    handleIsCorrect(
                                      queIdx,
                                      ansIdx,
                                      e.target.checked
                                    )
                                  }
                                  disabled={isSubmitted}
                                />
                              </Form.Group>
                              {ansIdx != 0 && (
                                <Col md={2}>
                                  <Button
                                    variant="danger"
                                    disabled={isSubmitted}
                                    onClick={() =>
                                      removeOptions(queIdx, ansIdx)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          );
                        })}
                        {!isSubmitted && (
                          <Row className="mt-2">
                            <Col md={3}>
                              <Button
                                disabled={isSubmitted}
                                onClick={() => addNewOption(queIdx)}
                              >
                                Add new option
                              </Button>
                            </Col>
                          </Row>
                        )}
                      </Form>
                    </>
                  );
                })}
              </Row>
              <Row className="mt-3">
                <Col md={3}>
                  <Button disabled={isSubmitted} onClick={addNewQue}>
                    Add another question!
                  </Button>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center mt-5">
                {!isSubmitted && (
                  <>
                    <Col md={4}>
                      <Button
                        variant="success"
                        onClick={() => handleSubmit(true)}
                      >
                        Save and Submit
                      </Button>
                    </Col>
                    <Col md={4}>
                      <Button
                        variant="info"
                        onClick={() => handleSubmit(false)}
                      >
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
        })}
      </div>
    </>
  );
};

export default ListQuestions;
