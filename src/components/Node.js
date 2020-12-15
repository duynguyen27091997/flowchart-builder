import React from 'react';

import "./Node.scss"
import {useState} from "react";
import {FaPlus} from "react-icons/fa";
import {actions, targets} from "../helpers/helpers";


const Node = ({drag}) => {
        let [show, setShow] = useState(false)
        let [value, setValue] = useState({
            name: '',
            description: '',
            action:'',
            target:''
        })

        const handleChange = (e) => {
            setValue({...value, [e.target.name]: e.target.value})
        }

        return (
            <div>
                <h5>NODE</h5>
                <div className="node" data-node={'node'} data-name={value.name} data-description={value.description}
                     data-action={value.action} data-target={value.target}
                     draggable={show} onDragEnd={() => {
                    setShow(false);
                    setValue({
                        name: '',
                        description: ''
                    })
                }} onDragStart={drag}>
                    {!show ? <div onClick={() => setShow(true)}><FaPlus/></div> :
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
                                <label>Hành động</label>
                                <select value={value.action} placeholder={'Hành động'} onChange={handleChange}
                                       name={'action'}>
                                    <option value="" disabled={true} selected={true}>...</option>
                                    {actions.map((item,key) => <option key={key} value={item}>{item}</option>)}
                                </select>
                            </div>
                            <div className={"node__form-group"}>
                                <label>Đối tượng</label>
                                <select value={value.target} placeholder={'Đối tượng'} onChange={handleChange}
                                       name={'target'}>
                                    <option value="" disabled={true} selected={true}>...</option>
                                    {targets.map((item,key) => <option key={key} value={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
;

export default Node;