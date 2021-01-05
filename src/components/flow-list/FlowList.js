import React from 'react';
import './FlowList.scss';
import {AiOutlinePlus} from "react-icons/ai";

const FlowList = ({list, selectWorkflow,createWorkflow}) => {
    return (
        <div>
            <ul className={'workflow-list'}>
                <li onClick={createWorkflow} className={'workflow-item create'}><AiOutlinePlus/> <span>Tạo</span></li>
                {list.map((item, index) => {
                    return <li onClick={() => selectWorkflow(item)} key={index}
                               className={'workflow-item'}>{(index + 1) + '. '}{item.label}</li>
                })}
            </ul>
        </div>
    );
};

export default FlowList;