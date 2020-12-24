import React, {useEffect} from 'react';

import "./Node.scss"
import {useState} from "react";
import {FaPlus} from "react-icons/fa";
import {actions, targets} from "../helpers/helpers";

import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

const options = [
    {value: 'chocolate', label: 'Chocolate'},
    {value: 'strawberry', label: 'Strawberry'},
    {value: 'vanilla', label: 'Vanilla'}
]
const animatedComponents = makeAnimated();

const loadOptions = (inputValue, callback) => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(data => {
            data = data.map(item => ({value: item.id, label: item.name}))
            callback(data)
        })
};

const Node = ({drag}) => {
        let template = {
            name: '',
            description: '',
            action: '',
            target: '',
            is_first: false
        };
        let [show, setShow] = useState(false)
        let [value, setValue] = useState(template);
        let [targets, setTargets] = useState([]);
        let [actions, setActions] = useState([]);

        const handleChecked = (e) => {
            setValue({...value, is_first: e.target.checked})
        }

        const handleChange = (e) => {
            setValue({...value, [e.target.name]: e.target.value})
        }
        const reset = () => {
            setShow(false);
            setValue(template)
        }

        const getData = async () => {
            const targets = await fetch('https://workflow.tuoitre.vn/api/step/get-action-target-types')
            const actions = await fetch('https://workflow.tuoitre.vn/api/step/get-action-types')
            return Promise.all([targets.json(), actions.json()])
        }

        useEffect(() => {
            getData().then(res => {
                let targets = Object.keys(res[0]).reduce((init, current) => {
                    return [...init, {value: current, label: res[0][current]}]
                }, []);
                setTargets(targets);
                let actions = Object.keys(res[1]).reduce((init, current) => {
                    return [...init, {value: current, label: res[1][current]}]
                }, []);
                setActions(actions);
            })
        }, []);

        const handleSelectChange = (val, action) => {
            let tmp = null;
            switch (action.name) {
                case 'action_target':
                case 'action': {
                    tmp = {value: val.value, name: val.label};
                    break;
                }
                case 'targets': {
                    tmp = val ? val.map(item => ({id: item.value, name: item.label, action: value.action.value, type: value.action_target.value})) : [];
                    break;
                }
            }
            setValue({...value, [action.name]: tmp});
        };

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
                                <Select
                                    onChange={handleSelectChange}
                                    name={'action_target'}
                                    options={targets}/>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Hành động</label>
                                <Select
                                    name={'action'}
                                    onChange={handleSelectChange}
                                    options={actions}/>
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