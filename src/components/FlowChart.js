import React, {useEffect} from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';
import axios from 'axios';

import Node from "./Node";
import FlowTool from "./FlowTool";


const FlowChart = ({workflow = null}) => {

    let [editor, drag, drop, allowDrop] = useFlowChart(workflow.value)

    // const getData = async () => {
    //     const targets = await fetch('https://workflow.tuoitre.vn/api/step/get-action-target-types');
    //     const actions = await fetch('https://workflow.tuoitre.vn/api/step/get-action-types');
    //     return Promise.all([targets.json(), actions.json(), workflowTypes.json()])
    // }

    useEffect(() => {
        if (workflow.value)
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
    }, [editor, workflow]);

    const handleSave = steps => {
        let data = {
            // workflow_name: workflow.workflow_name,
            // workflow_type: workflow.workflow_type,
            // workflow_description: workflow.workflow_description,
            steps: steps.steps
        }

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
            <aside className="flow__sidebar">
                <Node drag={drag}/>
                <FlowTool editor={editor} handleSave={handleSave}/>
            </aside>
            <main id={'draw-main'} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
        </div>
    );
};

export default FlowChart;