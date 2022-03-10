import react, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Form, Card, Container } from "react-bootstrap";
import { AppContext } from "../../contexts/appContext";
import Service from "../../utils/Service";
import "../../styles/addCategory.scss";
import {
  showSuccess,
  showInfo,
  showError,
  showConfirmation,
} from "../../utils/AlertService";
import ModalService from "../commons/CustomModal";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPaperPlane, FaPlusCircle } from "react-icons/fa";

function CategoryCrud(props) {
  const { userDetail, isAuth } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [categoryName, setCategoryName] = useState(
    props.categoryDetail?.data?.name ? props.categoryDetail?.data?.name : ""
  );
  const [description, setDescription] = useState(
    props.categoryDetail?.data?.description
      ? props.categoryDetail?.data?.description
      : ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let res;
    if (form.checkValidity()) {
      const reqBody = {
        name: categoryName,
        description,
      };

      res = props.categoryDetail
        ? await Service(
            "PATCH",
            `http://localhost:5555/quiz-category/update/${props.categoryDetail.data._id}`,
            reqBody,
            {},
            userDetail.token
          )
        : await Service(
            "POST",
            "http://localhost:5555/quiz-category/add",
            reqBody,
            {},
            userDetail.token
          );
      const { message, status } = res;

      if (status === 200) {
        showSuccess(message);
        props.setShow(false);
      } else if (status === 400) {
        showInfo(message);
      } else {
        showError(message);
      }
      // event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Name</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Control
              className="category-text-field"
              required
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide category name.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Description</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Control
              className="category-text-field"
              required
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide description.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button type="submit" className="submit-btn">
          {props.categoryDetail ? "Update" : "Add"}
        </Button>
      </Form>
    </>
  );
}

const ListCategory = () => {
  const { userDetail } = useContext(AppContext);
  const [categoryData, setCategoryData] = useState([]);
  const [show, setShow] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState(null);

  const categoryTitle = categoryDetail
    ? "Update Quiz Category"
    : "Add Quiz Category";

  const openAddCategoryModal = async (id = null) => {
    if (id) {
      const category = await Service(
        "GET",
        `http://localhost:5555/quiz-category/get-one/${id}`,
        {},
        {},
        userDetail.token
      );
      setCategoryDetail(category);
      setShow(true);
    } else {
      setCategoryDetail(null);
      setShow(true);
    }
  };

  const getCategoryList = async () => {
    const res = await Service(
      "GET",
      "http://localhost:5555/quiz-category/get-all",
      {},
      {},
      userDetail.token
    );
    setCategoryData(res.data);
  };

  const handleDelete = async (id) => {
    if (await showConfirmation("Are you sure you want to delete?")) {
      const res = await Service(
        "PATCH",
        `http://localhost:5555/quiz-category/delete/${id}`,
        {},
        {},
        userDetail.token
      );
      const { message, status } = res;

      if (status === 200) {
        showSuccess(message);
        getCategoryList();
      } else if (status === 400) {
        showInfo(message);
      } else {
        showError(message);
      }
    }
  };

  const submitQuizCategory = async (id) => {
    if (await showConfirmation("Are you sure you want to submit category?")) {
      const res = await Service(
        "PATCH",
        `http://localhost:5555/quiz-category/submit/${id}`,
        {},
        {},
        userDetail.token
      );
      const { message, status } = res;

      if (status === 200) {
        showSuccess(message);
        getCategoryList();
      } else if (status === 400) {
        showInfo(message);
      } else {
        showError(message);
      }
    }
  };

  useEffect(() => {
    if (!show) {
      getCategoryList();
    }
  }, [show]);
  return (
    <>
      <Row>
        {categoryData.map((category) => {
          return (
            <Col variant="primary" md={3} className="card-main">
              <Card style={{ width: "18rem" }} className="mb-3 category">
                <Link to={"/questions/" + category._id}>
                  <Card.Body className="text-card">
                    <Card.Title>{category.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {category.status}
                    </Card.Subtitle>
                    <Card.Text>{category.description}</Card.Text>
                  </Card.Body>
                </Link>
                <Card.Footer>
                  {category.status === "draft" && (
                    <>
                      <Button
                        className="button-action"
                        title="Edit"
                        onClick={() => openAddCategoryModal(category._id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="success"
                        title="Submit"
                        className="button-action"
                        onClick={() => submitQuizCategory(category._id)}
                      >
                        <FaPaperPlane />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="danger"
                    title="Delete"
                    onClick={() => handleDelete(category._id)}
                  >
                    <FaTrash />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
        <Col className="mt-4 ">
          <Button
            variant="secondary"
            onClick={() => openAddCategoryModal()}
            className="add-new-category-main"
          >
            <FaPlusCircle className="add-category-plus" />
          </Button>
        </Col>
      </Row>
      <ModalService
        show={show}
        setShow={setShow}
        title={categoryTitle}
        body={
          <CategoryCrud categoryDetail={categoryDetail} setShow={setShow} />
        }
      />
    </>
  );
};

export default ListCategory;
