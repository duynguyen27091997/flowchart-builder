import React, {useEffect} from 'react';

import "./Node.scss"
import {useState} from "react";
import {FaPlus} from "react-icons/fa";
import axios from "axios";

const specificTargets = [
    {label: 'Phòng nhân sự', value: 11},
    {label: 'Văn Tuấn', value: 111}
];


const Node = ({drag,getData}) => {
        let template = {
            name: '',
            description: '',
            action_target:'',
            action: '',
            targets: '',
            is_first: false
        };

        let [show, setShow] = useState(false)
        let [value, setValue] = useState(template);

        let [targets, setTargets] = useState([]);
        let [actions, setActions] = useState([]);

        useEffect(() => {
            getData().then(([resTargets, resActions]) => {
                let tmpTargets = Object.keys(resTargets).map((key, index) => {
                    return {value: key, label: resTargets[key]}
                }, [])
                setTargets(tmpTargets);

                let tmpActions = Object.keys(resActions).map((key, index) => {
                    return {value: key, label: resActions[key]}
                }, [])
                setActions(tmpActions);
            })
        }, []);

        const handleChange = (e) => {
            let tmp = null;
            switch (e.target.name) {
                case 'is_first':
                    setValue({...value, [e.target.name]: e.target.checked})
                    break;
                case 'action':
                    tmp = {value: actions[e.target.value].value, name: actions[e.target.value].label};
                    setValue({...value, [e.target.name]: tmp})
                    break;
                case 'action_target':
                    tmp = {value: targets[e.target.value].value, name: targets[e.target.value].label};
                    setValue({...value, [e.target.name]: tmp})
                    break;
                case 'targets': {
                    let findTarget = {};
                    findTarget.id = specificTargets[e.target.value].value;
                    findTarget.name = specificTargets[e.target.value].label;
                    findTarget.action =  value.action.value;
                    findTarget.type =  value.action_target.value

                    setValue({...value, [e.target.name]: [findTarget]})
                    break;
                }
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
                    {!show ? <div style={{textAlign: "center",padding:"10px"}} onClick={() => setShow(true)}><FaPlus/></div> :
                        <div style={{padding:"10px"}}>
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
                                <select defaultValue={''} name="action_target"  onChange={handleChange}>
                                    <option value="" disabled>...</option>
                                    {targets.map((item,index)=> <option value={index} key={item.value}>{item.label}</option>)}
                                </select>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Hành động</label>
                                <select defaultValue={''} name="action"  onChange={handleChange}>
                                    <option value="" disabled>...</option>
                                    {actions.map((item,index)=> <option value={index} key={item.value}>{item.label}</option>)}
                                </select>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Đối tượng cụ thể</label>
                                <select name="targets" defaultValue={''}  onChange={handleChange}>
                                    <option value="" disabled>...</option>
                                    {specificTargets.map((item,index)=> <option value={index} key={item.value}>{item.label}</option>)}
                                </select>
                            </div>
                            <div className={"node__form-group node__form-group-checked"}>
                                <input type="checkbox" name={'is_first'} value={value.is_first}
                                       onChange={handleChange}/><label>Khởi tạo</label>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
;

export default Node;