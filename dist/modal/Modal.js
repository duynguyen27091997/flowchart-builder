import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const Modal = ({
  isShowing,
  hide,
  children
}) => isShowing ? /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "modal-overlay"
}), /*#__PURE__*/React.createElement("div", {
  className: "modal-wrapper",
  "aria-modal": true,
  "aria-hidden": true,
  tabIndex: -1,
  role: "dialog"
}, /*#__PURE__*/React.createElement("div", {
  className: "modal"
}, /*#__PURE__*/React.createElement("div", {
  className: "modal-header"
}, /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "modal-close-button",
  "data-dismiss": "modal",
  "aria-label": "Close",
  onClick: hide
}, /*#__PURE__*/React.createElement("span", {
  "aria-hidden": "true"
}, "\xD7"))), /*#__PURE__*/React.createElement("div", {
  className: "modal-content"
}, children)))), document.body) : null;

export default Modal;