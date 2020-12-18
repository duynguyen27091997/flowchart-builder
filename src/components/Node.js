import React from 'react';

import "./Node.scss"
import {useState} from "react";
import {FaPlus} from "react-icons/fa";
import {actions, targets} from "../helpers/helpers";


const Node = ({drag}) => {
        let template = {
            name: '',
            description: '',
            action: '',
            target: '',

        };
        let [show, setShow] = useState(false)
        let [value, setValue] = useState(template)

        let [checked, setChecked] = useState(false)
        const handleChecked = (e) => {
            setChecked(!checked)
        }

        const handleChange = (e) => {
            setValue({...value, [e.target.name]: e.target.value})
        }
        const reset = () => {
            setShow(false);
            setValue(template)
        }

        return (
            <div>
                {/*<h5>NODE</h5>*/}
                <div className="node" data-node={'node'} data-checked={checked} data-name={value.name}
                     data-description={value.description}
                     data-action={value.action} data-target={value.target}
                     draggable={show} onDragEnd={() => reset()} onDragStart={drag}>
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
                                <select value={value.target} placeholder={'Đối tượng'} onChange={handleChange}
                                        name={'target'}>
                                    <option value="" disabled={true}>...</option>
                                    {targets.map((item, key) => <option key={key} value={item}>{item}</option>)}
                                </select>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Hành động</label>
                                <select value={value.action} placeholder={'Hành động'} onChange={handleChange}
                                        name={'action'}>
                                    <option value="" disabled={true}>...</option>
                                    {actions.map((item, key) => <option key={key} value={item}>{item}</option>)}
                                </select>
                            </div>
                            <div className={"node__form-group node__form-group-checked"}>
                                <input type="checkbox" name={'checked'} value={checked}
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