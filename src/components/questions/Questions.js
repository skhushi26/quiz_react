import React, { useContext, useEffect, useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppContext } from "../../contexts/appContext";
import Service from "../../utils/Service";
import "../../styles/questions.scss";
import { showSuccess, showInfo, showError } from "../../utils/AlertService";
import Score from "../Score";

const Questions = () => {
  const { userDetail } = useContext(AppContext);
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [quizGiven, setQuizGiven] = useState(false);

  const getQuestionsList = async () => {
    const res = await Service(
      "GET",
      `http://localhost:5555/quiz-category/get-question-by-category/${id}`,
      {},
      {},
      userDetail.token
    );
    setQuizGiven(res.data[0].is_quiz_given);
    if (res.data[0].is_quiz_given) {
      const quizResultRes = await Service(
        "GET",
        `http://localhost:5555/quiz-result/get/${id}`,
        {},
        {},
        userDetail.token
      );

      setQuestions(quizResultRes.data.questions);
      setTotalScore(quizResultRes.data.total_score);
    } else {
      const blankArry = new Array(res.data[0].questions.length);
      setQuestions(blankArry);
    }

    setQuiz(res.data[0]);
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleOption = (index, queId, ansId) => {
    if (!quizGiven) {
      const queObj = {
        question_id: queId,
        answer_id: ansId,
      };
      questions[index] = queObj;
      setQuestions([...questions]);
    }
  };

  const submitQuiz = async () => {
    const reqBody = {
      user_id: userDetail.userData._id,
      category_id: id,
      questions: questions,
    };
    const res = await Service(
      "POST",
      "http://localhost:5555/quiz-result/add",
      reqBody,
      {},
      userDetail.token
    );
    const { message, status } = res;

    if (status === 200) {
      showSuccess(message);
      setTotalScore(res.data.total_score);
      setIsSubmitted(true);
    } else if (status === 400) {
      showInfo(message);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    if (!isSubmitted) {
      getQuestionsList();
    }
  }, [isSubmitted]);

  return isSubmitted ? (
    <Score
      totalScore={totalScore}
      title="Thank you for playing quiz!!"
      categoryId={id}
      setIsSubmitted={setIsSubmitted}
      setCurrentQuestion={setCurrentQuestion}
    />
  ) : (
    <>
      <Container>
        <p className="question-title">{`${currentQuestion + 1})  ${
          quiz && quiz.questions[currentQuestion].question_name
        }`}</p>
        <div>
          <Row>
            {quiz &&
              quiz.questions[currentQuestion].options.map((optData, index) => {
                return (
                  <Col md={12} className="mb-2 options">
                    {quizGiven ? (
                      <div className="align-center">
                        <div
                          className={`${quizGiven ? "title no-hover" : "title"}

                        ${
                          questions[currentQuestion]?.answer_id == optData._id
                            ? optData.is_correct
                              ? "right"
                              : "wrong"
                            : ""
                        }
                        `}
                          onClick={() =>
                            handleOption(
                              currentQuestion,
                              quiz.questions[currentQuestion]._id,
                              optData._id
                            )
                          }
                        >
                          {optData.title}
                        </div>
                        <div className="correct-text">
                          {optData.is_correct ? "Correct answer" : ""}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`title ${
                          questions[currentQuestion] &&
                          optData._id == questions[currentQuestion].answer_id
                            ? "option-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleOption(
                            currentQuestion,
                            quiz.questions[currentQuestion]._id,
                            optData._id
                          )
                        }
                      >
                        {optData.title}
                      </div>
                    )}
                  </Col>
                );
              })}
          </Row>
        </div>
        <div className="d-flex justify-content-between mt-5">
          {/* {quiz && currentQuestion != 0 && (
          
        )} */}
          <Button
            className="que-button"
            disabled={quiz && currentQuestion == 0}
            onClick={handlePrevious}
          >
            Previous
          </Button>

          {quiz && quiz.questions.length - 1 === currentQuestion ? (
            !quizGiven && (
              <Button className="que-button" onClick={submitQuiz}>
                Submit
              </Button>
            )
          ) : (
            <Button className="que-button" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>

        {quizGiven && (
          <Score
            totalScore={totalScore}
            title=""
            preview={false}
            categoryId={id}
            setIsSubmitted={setIsSubmitted}
            setCurrentQuestion={setCurrentQuestion}
          />
        )}
      </Container>
    </>
  );
};

export default Questions;
