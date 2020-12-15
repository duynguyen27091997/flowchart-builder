import React,{useRef} from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';

import Node from "./Node";
import {FaLock, FaLockOpen, FaSearch, FaSearchMinus, FaSearchPlus} from "react-icons/fa";

const FlowChart = ({workflowId=1}) => {

    let [editor,drag,drop,allowDrop] = useFlowChart(workflowId)

    console.log(editor)

    return (
        <div className={"flow"}>
            <aside className="flow__sidebar">
                <Node drag={drag}/>
                <div><div className="btn-clear" style={{userSelect:'none'}} onClick={()=>editor.clear()}>Xóa</div>
                    <div className="btn-save" style={{userSelect:'none'}} onClick={()=>{console.log(editor.export())}}>Lưu</div></div>
                {/*<div className="btn-lock">*/}
                {/*    {(editor && editor.editor_mode === 'edit') ? <FaLock onClick={() => {*/}
                {/*            editor.lock();*/}
                {/*        }}/> :*/}
                {/*        <FaLockOpen onClick={() => {*/}
                {/*            editor.unlock();*/}
                {/*        }}/>*/}
                {/*    }*/}
                {/*</div>*/}
                <div className="bar-zoom">
                    <FaSearchMinus onClick={() => editor.zoom_out()}/>
                    <FaSearchPlus onClick={() => editor.zoom_in()}/>
                    <FaSearch onClick={() => editor.zoom_reset()}/>
                </div>
            </aside>
            <main  id={workflowId} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>

        </div>

    );
};

export default FlowChart;