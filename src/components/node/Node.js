import React, {useEffect} from 'react';

import "./Node.scss"
import {useState} from "react";
import {FaPlus} from "react-icons/fa";

const loadOptions = (inputValue, callback) => {
    callback([
        {label: 'Phòng nhân sự', value: 11},
        {label: 'Văn Tuấn', value: 111}
    ])
};

// const getData = async () => {
//     const targets = await fetch('https://workflow.tuoitre.vn/api/step/get-action-target-types');
//     const actions = await fetch('https://workflow.tuoitre.vn/api/step/get-action-types');
//     return Promise.all([targets.json(), actions.json(), workflowTypes.json()])
// }

const Node = ({drag}) => {
        let template = {
            name: '',
            description: '',
            actions: '',
            targets: '',
            is_first: false
        };

        let [show, setShow] = useState(false)
        let [value, setValue] = useState(template);


        const handleChange = (e) => {
            switch (e.target.name) {
                case 'is_first':
                    setValue({...value, [e.target.name]: e.target.checked})
                    break;
                default:
                    setValue({...value, [e.target.name]: e.target.value})
                    break;
            }

        }


        const reset = () => {
            setShow(false);
            setValue(template)
        }


        return (
            <div>
                {/*<h5>NODE</h5>*/}
                <div className="node"
                     draggable={show} onDragEnd={() => reset()} onDragStart={(e) => drag(value, e)}>
                    {!show ? <div style={{textAlign: "center"}} onClick={() => setShow(true)}><FaPlus/></div> :
                        <div>
                            <div className={"node__form-group"}>
                                <label>Title</label>
                                <input type="text" value={value.name} placeholder={'Tiêu đề'} onChange={handleChange}
                                       name={'name'}/>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Description</label>
                                <input type="text" value={value.description} placeholder={'Mô tả'} onChange={handleChange}
                                       name={'description'}/>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Đối tượng</label>

                            </div>
                            <div className={"node__form-group"}>
                                <label>Hành động</label>

                            </div>
                            <div className={"node__form-group"}>
                                <label>Đối tượng cụ thể</label>

                            </div>
                            <div className={"node__form-group node__form-group-checked"}>
                                <input type="checkbox" name={'is_first'} value={value.is_first}
                                       onChange={handleChange}/><label>first</label>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
;

export default Node;