import React from 'react';
import './Loading.scss';

const Loading = ({
  show = false
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: 'overlay-loading',
    style: {
      display: show ? 'flex' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lds-ripple"
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null)));
};

export default Loading;