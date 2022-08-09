import React from "react";

import Modal from 'react-modal';

export default function ModalParamEdit({ ParamEditIsOpen })  {
  return (
    <Modal isOpen={ParamEditIsOpen} ariaHideApp={false}>
          <div>
              <h1>Hello from Modal</h1>
              {/* <button onClick={closeParamEdit}>close</button> */}
        </div>
    </Modal>
  );
}