import React from 'react';
import './FlowList.scss';

const FlowList = props => {
    let {
        list = [],
        clickHandle
    } = props;
    return (
        <div className="list-type-select">
            <ol className="dd-list">
                {
                    list.map((item, index) =>
                        <li
                            className={`dd-item ${item.children.length > 0 && 'dd-parent'}`}
                            onClick={() => {
                                if (item.children.length === 0) {
                                    clickHandle && clickHandle(item)
                                }
                            }}
                            key={index}>
                            <div className={`dd-handle ${item.children.length > 0 && 'parent-title'}`}>{item.display_name}</div>
                            {item.children.length > 0 && <FlowList list={item.children} clickHandle={clickHandle}/>}
                        </li>)
                }
            </ol>
        </div>
    );
};

export default FlowList;