import React, {useState,useEffect} from 'react';
import FlowChart from "./flow-chart/FlowChart";
import axios from "axios";
import FlowList from "./flow-list/FlowList";
import Loading from "./loading/Loading";
import useModal from "../hooks/useModal";
import Modal from "./modal/Modal";
import './Flow.scss';
import CreateWorkflow from "./CreateWorkflow";

function Flow({urls={}}) {

    let {
      workflowTypesUrl = 'https://workflow.tuoitre.vn/api/workflow/get-workflow-types',
      storeStepsUrl='https://workflow.tuoitre.vn/api/step/store-steps',
      workflowDetailUrl='https://workflow.tuoitre.vn/api/workflow/detail?type=',
      targetTypeUrl = 'https://workflow.tuoitre.vn/api/step/get-action-target-types',
      actionTypeUrl = 'https://workflow.tuoitre.vn/api/step/get-action-types',
    } = urls;

    let [listWorkflow,setListWorkflow] = useState([]);
    let [workflow,setWorkflow] = useState(null);
    let [loading,setLoading] = useState(true);

    const {isShowing, toggle} = useModal();

    useEffect(()=>{
        axios.get(workflowTypesUrl)
            .then(res=>{
                if (res.status===200){
                    let tmp = Object.keys(res.data).map((key, index) => {
                        return {value: key, label: res.data[key]}
                    }, []);
                    setListWorkflow(tmp)
                }else{

                }
            })
            .catch()
            .finally(()=>setLoading(false))
    },[])
    return (
        <div className="flow-container">
            <Loading show={loading} />
            {
                workflow ? <FlowChart workflow={workflow} unselectWorkflow={()=>setWorkflow(null)} workflowDetailUrl={workflowDetailUrl} storeStepsUrl={storeStepsUrl}
                    targetTypesUrl={targetTypeUrl} actionTypeUrl={actionTypeUrl}
                  />
                    :
                    <FlowList list={listWorkflow} selectWorkflow={(workflow)=> setWorkflow(workflow)} createWorkflow={()=>toggle()} />
            }
            <Modal
                isShowing={isShowing}
                hide={toggle}
            >
             <CreateWorkflow listType={listWorkflow} createWorkflow={workflow => {
                 setWorkflow(workflow);toggle()}} />
            </Modal>

        </div>
    );
}

export default Flow;
