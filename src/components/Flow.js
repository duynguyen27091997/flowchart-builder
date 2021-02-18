import React, { useState, useEffect } from "react";
import FlowChart from "./flow-chart/FlowChart";
import axios from "axios";
import FlowList from "./flow-list/FlowList";
import Loading from "./loading/Loading";
import useModal from "../hooks/useModal";
import Modal from "./modal/Modal";
import "./Flow.scss";
import CreateWorkflow from "./CreateWorkflow";

function Flow({ urls = {} }) {

  let {
    workflowTypesUrl = "https://workflow.tuoitre.vn/api/workflow/get-workflow-types",
    storeStepsUrl = "https://workflow.tuoitre.vn/api/workflow/store",
    workflowDetailUrl = "https://workflow.tuoitre.vn/api/workflow/detail?type=",
    targetTypeUrl = "https://workflow.tuoitre.vn/api/step/get-action-target-types",
    actionTypeUrl = "https://workflow.tuoitre.vn/api/step/get-action-types"
  } = urls;

  let [listWorkflow, setListWorkflow] = useState([]);
  let [workflow, setWorkflow] = useState(null);

  let [selectedWorkflowType, setSelectedWorkflowType] = useState('');

  let [loading, setLoading] = useState(true);

  const { isShowing, toggle } = useModal();

  useEffect(() => {
    axios.get(workflowTypesUrl)
      .then(res => {
        if (res.status === 200) {
          let tmp = Object.keys(res.data).map((key, index) => {
            return { value: key, label: res.data[key] };
          }, []);
          setListWorkflow(tmp);
        } else {

        }
      })
      .catch()
      .finally(() => setLoading(false));
  }, []);

  const selectWorkflow = (workflow) => {
    setLoading(true);
    axios.get(`${workflowDetailUrl}${workflow.value}`)
      .then(res => {
        if (res.status === 200 && res.data) {
          setWorkflow(res.data);
        } else {
          setSelectedWorkflowType(workflow.value);
          toggle();
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateWorkflow = workflow => {
    setWorkflow(workflow);
    toggle();
  };

  const handleCancelCreate = () => {
    toggle();
    setWorkflow(null);
    setSelectedWorkflowType('');
  };

  return (
    <div className="flow-container">
      <Loading show={loading} />
      {
        workflow ? <FlowChart setWorkflow={setWorkflow} workflow={workflow} createWorkflow={() => {
            toggle();
            setSelectedWorkflowType('')
          }} unselectWorkflow={() => {setWorkflow(null);setSelectedWorkflowType('')}} workflowDetailUrl={workflowDetailUrl}
                              storeStepsUrl={storeStepsUrl}
                              targetTypesUrl={targetTypeUrl} actionTypeUrl={actionTypeUrl}
          />
          :
          <FlowList list={listWorkflow} selectWorkflow={(workflow) => selectWorkflow(workflow)}
                    createWorkflow={() => toggle()} />
      }
      <Modal
        isShowing={isShowing}
        hide={() => {
          handleCancelCreate();
        }}
      >
        <CreateWorkflow initData={{name:'',description:'',type:selectedWorkflowType}} listType={listWorkflow}
                        createWorkflow={workflow => handleCreateWorkflow(workflow)} />
      </Modal>

    </div>
  );
}

export default Flow;
