import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Activity from "./Activity";

const NewActivity = props => {
  const [show, setShow] = useState(false);

  const getDate = () => {
    let today = new Date();
    let d = today.getDate();
    let m = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    return d + '.' + m + '.' + yyyy;
  }

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
                eventDate={getDate()}
            />
          </Modal.Body>
        </Modal>
      </>
  );
}

export default NewActivity;
