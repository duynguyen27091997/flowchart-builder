import React, { useEffect } from 'react';
import "./Node.scss";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
const specificTargets = [{
  label: 'Phòng nhân sự',
  value: 11
}, {
  label: 'Văn Tuấn',
  value: 111
}];

const getData = async () => {
  const targets = await axios('https://workflow.tuoitre.vn/api/step/get-action-target-types').then(res => res.data);
  const actions = await axios('https://workflow.tuoitre.vn/api/step/get-action-types').then(res => res.data);
  return [targets, actions];
};

const Node = ({
  drag
}) => {
  let template = {
    name: '',
    description: '',
    action_target: '',
    action: '',
    targets: '',
    is_first: false
  };
  let [show, setShow] = useState(false);
  let [value, setValue] = useState(template);
  let [targets, setTargets] = useState([]);
  let [actions, setActions] = useState([]);
  useEffect(() => {
    getData().then(([resTargets, resActions]) => {
      let tmpTargets = Object.keys(resTargets).map((key, index) => {
        return {
          value: key,
          label: resTargets[key]
        };
      }, []);
      setTargets(tmpTargets);
      let tmpActions = Object.keys(resActions).map((key, index) => {
        return {
          value: key,
          label: resActions[key]
        };
      }, []);
      setActions(tmpActions);
    });
  }, []);

  const handleChange = e => {
    let tmp = null;

    switch (e.target.name) {
      case 'is_first':
        setValue({ ...value,
          [e.target.name]: e.target.checked
        });
        break;

      case 'action':
        tmp = {
          value: actions[e.target.value].value,
          name: actions[e.target.value].label
        };
        setValue({ ...value,
          [e.target.name]: tmp
        });
        break;

      case 'action_target':
        tmp = {
          value: targets[e.target.value].value,
          name: targets[e.target.value].label
        };
        setValue({ ...value,
          [e.target.name]: tmp
        });
        break;

      case 'targets':
        {
          let findTarget = {};
          findTarget.id = specificTargets[e.target.value].value;
          findTarget.name = specificTargets[e.target.value].label;
          findTarget.action = value.action.value;
          findTarget.type = value.action_target.value;
          setValue({ ...value,
            [e.target.name]: [findTarget]
          });
          break;
        }

      default:
        setValue({ ...value,
          [e.target.name]: e.target.value
        });
        break;
    }
  };

  const reset = () => {
    setShow(false);
    setValue(template);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "node",
    draggable: show,
    onDragEnd: () => reset(),
    onDragStart: e => drag(value, e)
  }, !show ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    },
    onClick: () => setShow(true)
  }, /*#__PURE__*/React.createElement(FaPlus, null)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "node__form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: value.name,
    placeholder: 'Tiêu đề',
    onChange: handleChange,
    name: 'name'
  })), /*#__PURE__*/React.createElement("div", {
    className: "node__form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Description"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: value.description,
    placeholder: 'Mô tả',
    onChange: handleChange,
    name: 'description'
  })), /*#__PURE__*/React.createElement("div", {
    className: "node__form-group"
  }, /*#__PURE__*/React.createElement("label", null, "\u0110\u1ED1i t\u01B0\u1EE3ng"), /*#__PURE__*/React.createElement("select", {
    defaultValue: '',
    name: "action_target",
    onChange: handleChange
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "..."), targets.map((item, index) => /*#__PURE__*/React.createElement("option", {
    value: index,
    key: item.value
  }, item.label)))), /*#__PURE__*/React.createElement("div", {
    className: "node__form-group"
  }, /*#__PURE__*/React.createElement("label", null, "H\xE0nh \u0111\u1ED9ng"), /*#__PURE__*/React.createElement("select", {
    defaultValue: '',
    name: "action",
    onChange: handleChange
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "..."), actions.map((item, index) => /*#__PURE__*/React.createElement("option", {
    value: index,
    key: item.value
  }, item.label)))), /*#__PURE__*/React.createElement("div", {
    className: "node__form-group"
  }, /*#__PURE__*/React.createElement("label", null, "\u0110\u1ED1i t\u01B0\u1EE3ng c\u1EE5 th\u1EC3"), /*#__PURE__*/React.createElement("select", {
    name: "targets",
    defaultValue: '',
    onChange: handleChange
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "..."), specificTargets.map((item, index) => /*#__PURE__*/React.createElement("option", {
    value: index,
    key: item.value
  }, item.label)))), /*#__PURE__*/React.createElement("div", {
    className: "node__form-group node__form-group-checked"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: 'is_first',
    value: value.is_first,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement("label", null, "first")))));
};

export default Node;