import React, {useState,useEffect} from 'react';
import FlowChart from "./flow-chart/FlowChart";
import axios from "axios";
import FlowList from "./flow-list/FlowList";
import Loading from "./loading/Loading";
import useModal from "../hooks/useModal";
import Modal from "./modal/Modal";
import './Flow.scss';
import CreateWorkflow from "./CreateWorkflow";

function Flow() {
    let [listWorkflow,setListWorkflow] = useState([]);
    let [workflow,setWorkflow] = useState(null);
    let [loading,setLoading] = useState(true);

    const {isShowing, toggle} = useModal();

    useEffect(()=>{
        axios.get('https://workflow.tuoitre.vn/api/workflow/get-workflow-types')
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
                workflow ? <FlowChart workflow={workflow} unselectWorkflow={()=>setWorkflow(null)} />
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
