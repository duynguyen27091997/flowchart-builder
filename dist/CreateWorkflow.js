import React, { useState } from 'react';

const CreateWorkflow = ({
  listType,
  createWorkflow
}) => {
  let template = {
    workflow_name: '',
    workflow_description: '',
    workflow_type: '',
    workflow_new: true
  };
  let [value, setValue] = useState(template);

  const handleChange = e => {
    setValue({ ...value,
      [e.target.name]: e.target.value
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Workflow name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: 'Tiêu đề',
    value: value.workflow_name,
    onChange: handleChange,
    name: 'workflow_name'
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Workflow description"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: 'Mô tả',
    value: value.workflow_description,
    onChange: handleChange,
    name: 'workflow_description'
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Workflow type"), /*#__PURE__*/React.createElement("select", {
    name: "workflow_type",
    value: value.workflow_type,
    onChange: handleChange
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "..."), listType.map((item, index) => {
    return /*#__PURE__*/React.createElement("option", {
      value: item.value,
      key: index
    }, item.label);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => createWorkflow(value),
    type: 'button',
    className: "btn button-default btn-submit"
  }, "T\u1EA1o workflow")));
};

export default CreateWorkflow;