import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Activity from "./Activity";

const NewActivity = props => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Uusi Suorite
        </Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            uusi suorite
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Activity
            appendActivity={props.appendActivity}
            setModalShow={setShow}
            eventDate={new Date()}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewActivity;
