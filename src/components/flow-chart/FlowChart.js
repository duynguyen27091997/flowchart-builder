import React, {useEffect,useState} from 'react';
import useFlowChart from "../../hooks/useFlowChart";
import './FlowChart.scss';

import axios from 'axios';
import Node from "../node/Node";
import FlowTool from "../flow-tool/FlowTool";
import {AiOutlineRollback} from "react-icons/ai";
import Loading from "../loading/Loading";


const FlowChart = ({workflow = null,unselectWorkflow}) => {

    let [editor, drag, drop, allowDrop] = useFlowChart()
    let [loading,setLoading] = useState(false);

    useEffect(() => {
        if (workflow.value && !workflow.workflow_new) {
            setLoading(true)
            axios.get(`https://workflow.tuoitre.vn/api/workflow/detail?type=${workflow.value}`)
                .then(res => {
                    if (res.status === 200) {
                        editor.clear()
                        editor.import(res.data);
                    } else {

                    }
                })
                .catch(err => {
                })
                .finally(() => setLoading(false))
        }
    }, [editor, workflow]);

    const handleSave = steps => {
        let data={
            steps: steps.steps
        }
        //name
        if (workflow.workflow_name)
            data.workflow_name = workflow.workflow_name;

        //type
        if (workflow.workflow_type)
            data.workflow_type = workflow.workflow_type;
        else if (workflow.value)
            data.workflow_type = workflow.value;
        //description
        if (workflow.workflow_description)
            data.workflow_description = workflow.workflow_description;
        
        data.workflow_pos_x = editor.pos_x;
        data.workflow_pos_y = editor.pos_y;


        axios.post('https://workflow.tuoitre.vn/api/step/store-steps', data)
            .then(res => {
                editor.clear()
            })
            .catch(err => {
            })

    }

    if (editor) {
        editor.start();
    }

    return (<div className={"flow"}>
            <Loading show={loading} />
            <aside className="flow__sidebar">
                <button onClick={unselectWorkflow} className={'btn btn--back'}>
                    <AiOutlineRollback size={'25'}/>
                </button>
                <Node drag={drag}/>
                <FlowTool editor={editor} handleSave={handleSave}/>
            </aside>
            <main id={'draw-main'} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
        </div>
    );
};

export default FlowChart;