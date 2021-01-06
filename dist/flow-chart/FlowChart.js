import React, { useEffect, useState } from 'react';
import useFlowChart from "../../hooks/useFlowChart";
import './FlowChart.scss';
import axios from 'axios';
import Node from "../node/Node";
import FlowTool from "../flow-tool/FlowTool";
import { AiOutlineRollback } from "react-icons/ai";
import Loading from "../loading/Loading";

const FlowChart = ({
  workflow = null,
  unselectWorkflow
}) => {
  let [editor, drag, drop, allowDrop] = useFlowChart();
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    if (workflow.value && !workflow.workflow_new) {
      setLoading(true);
      axios.get(`https://workflow.tuoitre.vn/api/workflow/detail?type=${workflow.value}`).then(res => {
        if (res.status === 200) {
          editor.clear();
          editor.import(res.data);
        } else {}
      }).catch(err => {}).finally(() => setLoading(false));
    }
  }, [editor, workflow]);

  const handleSave = steps => {
    let data = {
      steps: steps.steps
    }; //name

    if (workflow.workflow_name) data.workflow_name = workflow.workflow_name; //type

    if (workflow.workflow_type) data.workflow_type = workflow.workflow_type;else if (workflow.value) data.workflow_type = workflow.value; //description

    if (workflow.workflow_description) data.workflow_description = workflow.workflow_description;
    data.workflow_pos_x = editor.pos_x;
    data.workflow_pos_y = editor.pos_y;
    axios.post('https://workflow.tuoitre.vn/api/step/store-steps', data).then(res => {
      editor.clear();
    }).catch(err => {});
  };

  if (editor) {
    editor.start();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "flow"
  }, /*#__PURE__*/React.createElement(Loading, {
    show: loading
  }), /*#__PURE__*/React.createElement("aside", {
    className: "flow__sidebar"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: unselectWorkflow,
    className: 'btn btn--back'
  }, /*#__PURE__*/React.createElement(AiOutlineRollback, {
    size: '25'
  })), /*#__PURE__*/React.createElement(Node, {
    drag: drag
  }), /*#__PURE__*/React.createElement(FlowTool, {
    editor: editor,
    handleSave: handleSave
  })), /*#__PURE__*/React.createElement("main", {
    id: 'draw-main',
    className: "flow__draw",
    onDragOver: allowDrop,
    onDrop: drop
  }));
};

export default FlowChart;