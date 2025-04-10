import React from 'react';
import { BsXLg } from 'react-icons/bs';

function Modal({ titulo, boton2, isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal modal-lg fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{titulo}</h5>
                            <button className="btn btn-light" onClick={onClose} style={{ marginLeft: 'auto' }} aria-label="Close">
                                <BsXLg />
                            </button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>{boton2}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;
