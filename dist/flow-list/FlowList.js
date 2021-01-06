import React from 'react';
import './FlowList.scss';
import { AiOutlinePlus } from "react-icons/ai";

const FlowList = ({
  list,
  selectWorkflow,
  createWorkflow
}) => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
    className: 'workflow-list'
  }, /*#__PURE__*/React.createElement("li", {
    onClick: createWorkflow,
    className: 'workflow-item create'
  }, /*#__PURE__*/React.createElement(AiOutlinePlus, null), " ", /*#__PURE__*/React.createElement("span", null, "T\u1EA1o")), list.map((item, index) => {
    return /*#__PURE__*/React.createElement("li", {
      onClick: () => selectWorkflow(item),
      key: index,
      className: 'workflow-item'
    }, index + 1 + '. ', item.label);
  })));
};

export default FlowList;