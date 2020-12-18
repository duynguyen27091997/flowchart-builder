import React from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';

import Node from "./Node";
import FlowTool from "./FlowTool";

const FlowChart = ({workflowId=1}) => {

    let [editor,drag,drop,allowDrop] = useFlowChart(workflowId)

    console.log(editor)

    return (
        <div className={"flow"}>
            <aside className="flow__sidebar">
                <Node drag={drag}/>
                <FlowTool editor={editor}/>
            </aside>
            <main  id={workflowId} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
        </div>

    );
};

export default FlowChart;