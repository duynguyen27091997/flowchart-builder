import React,{useRef} from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';

import {FaLock, FaLockOpen, FaSearch, FaSearchMinus, FaSearchPlus} from "react-icons/fa";

const FlowChart = () => {

    let workflowRef = useRef(null)
    let elementsRef = useRef(null)
    let idWorkflow = 'workflowDraw', classElement = 'element';

    let editor = useFlowChart(idWorkflow, classElement)

    console.log(editor)

    return (
        <div className={"workflow"}>
            <aside className="workflow__sidebar">
                <ul ref={elementsRef} className={'elements'}>
                    <li draggable data-node={'simple'} className={classElement}>Node simple</li>
                </ul>
                <div><div className="btn-clear" style={{userSelect:'none'}} onClick={()=>editor.clearModuleSelected()}>Xóa</div>
                    <div className="btn-save" style={{userSelect:'none'}} onClick={()=>{}}>Lưu</div></div>
                <div className="btn-lock">
                    {(editor && editor.editor_mode === 'edit') ? <FaLock onClick={() => {
                            editor.lock();
                        }}/> :
                        <FaLockOpen onClick={() => {
                            editor.unlock();
                        }}/>
                    }
                </div>
                <div className="bar-zoom">
                    <FaSearchMinus onClick={() => editor.zoom_out()}/>
                    <FaSearchPlus onClick={() => editor.zoom_in()}/>
                    <FaSearch onClick={() => editor.zoom_reset()}/>
                </div>
            </aside>
            <main ref={workflowRef} id={idWorkflow} className="workflow__draw"/>

        </div>

    );
};

export default FlowChart;