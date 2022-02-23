import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const ModalService = (props) => {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    setModalShow(props.show);
  }, [props.show]);

  const handleClose = () => props.setShow(false);
  console.log("call modal service", props);
  return (
    <Modal show={modalShow} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      {/* <Modal.Footer>{props.footer}</Modal.Footer> */}
    </Modal>
  );
};

export default ModalService;
