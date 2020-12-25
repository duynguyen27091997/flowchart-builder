import React, {useEffect} from 'react';

import "./Node.scss"
import {useState} from "react";
import {FaPlus} from "react-icons/fa";

import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const loadOptions = (inputValue, callback) => {
    callback([
        {label: 'Phòng nhân sự', value: 11},
        {label: 'Văn Tuấn', value: 111}
    ])
};

const Node = ({drag, setWorkflow, dataTargets, dataActions, dataWorkflowTypes}) => {
        let template = {
            name: '',
            description: '',
            actions: '',
            targets: '',
            is_first: false
        };

        let [show, setShow] = useState(false)
        let [value, setValue] = useState(template);
        let [workflowLocal, setWorkflowLocal] = useState({});

        const handleChecked = (e) => {
            setValue({...value, is_first: e.target.checked})
        }

        const handleChange = (e) => {
            setValue({...value, [e.target.name]: e.target.value})
        }

        const handleChangeWorkflow = (e) => {
            setWorkflowLocal({...workflowLocal, [e.target.name]: e.target.value});
            setWorkflow({...workflowLocal, [e.target.name]: e.target.value})
        }

        const handleSelectChangeWorkflow = (val, action) => {
            setWorkflowLocal({...workflowLocal, [action.name]: {value: val.value, name: val.label}});
            setWorkflow({...workflowLocal, [action.name]: val.value});
        };

        const reset = () => {
            setShow(false);
            setValue(template)
        }


        const handleSelectChange = (val, action) => {
            let tmp = null;
            switch (action.name) {
                case 'action_target':
                case 'action': {
                    tmp = {value: val.value, name: val.label};
                    break;
                }
                case 'targets': {
                    tmp = val ? val.map(item => ({
                        id: item.value,
                        name: item.label,
                        action: value.action.value,
                        type: value.action_target.value
                    })) : [];
                    break;
                }
            }
            setValue({...value, [action.name]: tmp});
        };

        return (
            <div>
                <div className="node">
                    <div>
                        <div className={"node__form-group"}>
                            <label>Workflow name</label>
                            <input type="text" value={workflowLocal.workflow_name} onChange={handleChangeWorkflow}
                                   name={'workflow_name'}/>
                        </div>
                        <div className={"node__form-group"}>
                            <label>Workflow description</label>
                            <input type="text" value={workflowLocal.workflow_description} onChange={handleChangeWorkflow}
                                   name={'workflow_description'}/>
                        </div>
                        <div className={"node__form-group"}>
                            <label>Type</label>
                            <Select
                                onChange={handleSelectChangeWorkflow}
                                name={'workflow_type'}
                                options={dataWorkflowTypes}/>
                        </div>
                    </div>
                </div>
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
                                <Select
                                    onChange={handleSelectChange}
                                    name={'action_target'}
                                    options={dataTargets}/>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Hành động</label>
                                <Select
                                    name={'action'}
                                    onChange={handleSelectChange}
                                    options={dataActions}/>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Đối tượng cụ thể</label>
                                <AsyncSelect closeMenuOnSelect={true}
                                             onChange={handleSelectChange}
                                             name={'targets'}
                                             defaultOptions
                                             components={animatedComponents}
                                             cacheOptions
                                             isMulti
                                             disabled
                                             loadOptions={loadOptions}/>
                            </div>
                            <div className={"node__form-group node__form-group-checked"}>
                                <input type="checkbox" name={'is_first'} value={value.is_first}
                                       onChange={handleChecked}/><label>first</label>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
;

export default Node;