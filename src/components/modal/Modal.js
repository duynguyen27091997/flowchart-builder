import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const Modal = ({ isShowing, hide,children }) => isShowing ? ReactDOM.createPortal(
    <div className={'flow-modal'}>
        <div className="modal-overlay"/>
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal">
                <div className="modal-header">
                    <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    </div>, document.body
) : null;

export default Modal;