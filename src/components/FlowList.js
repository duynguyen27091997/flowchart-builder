import React from 'react';
import './FlowList.scss';

const FlowList = ({list,selectWorkflow}) => {
    return (
        <div>
            {
                list.length ?
                    <ul className={'workflow-list'}>
                        {list.map((item,index)=>{
                           return  <li onClick={()=>selectWorkflow(item)} key={index} className={'workflow-item'}>{item.label}</li>
                        })}
                    </ul>
                    :
                    <h5>Không tồn tại workflow ...</h5>
            }
        </div>
    );
};

export default FlowList;