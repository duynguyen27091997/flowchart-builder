import React from 'react';
import { FaSearch, FaSearchMinus, FaSearchPlus } from "react-icons/fa";

const FlowTool = ({
  editor,
  handleSave
}) => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "btn-clear",
    style: {
      userSelect: 'none'
    },
    onClick: () => editor.clear()
  }, "X\xF3a"), /*#__PURE__*/React.createElement("div", {
    className: "btn-save",
    style: {
      userSelect: 'none'
    },
    onClick: () => {
      handleSave(editor.export());
    }
  }, "L\u01B0u")), /*#__PURE__*/React.createElement("div", {
    className: "bar-zoom"
  }, /*#__PURE__*/React.createElement(FaSearchMinus, {
    onClick: () => editor.zoom_out()
  }), /*#__PURE__*/React.createElement(FaSearchPlus, {
    onClick: () => editor.zoom_in()
  }), /*#__PURE__*/React.createElement(FaSearch, {
    onClick: () => editor.zoom_reset()
  })));
};

export default FlowTool;