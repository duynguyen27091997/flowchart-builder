import React,{useEffect} from 'react';

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
            is_first:false
        };
        let [show, setShow] = useState(false)
        let [value, setValue] = useState(template)

        const handleChecked = (e) => {
            setValue({...value,is_first:e.target.checked})
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
                <div className="node"
                     draggable={show} onDragEnd={() => reset()} onDragStart={(e)=>drag(value,e)}>
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