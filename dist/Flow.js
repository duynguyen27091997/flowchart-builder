import React, { useState, useEffect } from 'react';
import FlowChart from "./flow-chart/FlowChart";
import axios from "axios";
import FlowList from "./flow-list/FlowList";
import Loading from "./loading/Loading";
import useModal from "../hooks/useModal";
import Modal from "./modal/Modal";
import './Flow.scss';
import CreateWorkflow from "./CreateWorkflow";

function Flow() {
  let [listWorkflow, setListWorkflow] = useState([]);
  let [workflow, setWorkflow] = useState(null);
  let [loading, setLoading] = useState(true);
  const {
    isShowing,
    toggle
  } = useModal();
  useEffect(() => {
    axios.get('https://workflow.tuoitre.vn/api/workflow/get-workflow-types').then(res => {
      if (res.status === 200) {
        let tmp = Object.keys(res.data).map((key, index) => {
          return {
            value: key,
            label: res.data[key]
          };
        }, []);
        setListWorkflow(tmp);
      } else {}
    }).catch().finally(() => setLoading(false));
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "flow-container"
  }, /*#__PURE__*/React.createElement(Loading, {
    show: loading
  }), workflow ? /*#__PURE__*/React.createElement(FlowChart, {
    workflow: workflow,
    unselectWorkflow: () => setWorkflow(null)
  }) : /*#__PURE__*/React.createElement(FlowList, {
    list: listWorkflow,
    selectWorkflow: workflow => setWorkflow(workflow),
    createWorkflow: () => toggle()
  }), /*#__PURE__*/React.createElement(Modal, {
    isShowing: isShowing,
    hide: toggle
  }, /*#__PURE__*/React.createElement(CreateWorkflow, {
    listType: listWorkflow,
    createWorkflow: workflow => {
      setWorkflow(workflow);
      toggle();
    }
  })));
}

export default Flow;