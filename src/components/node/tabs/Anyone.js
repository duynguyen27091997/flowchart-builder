import Rect, {useState, useEffect} from 'react';
import {Form, Tab} from "react-bootstrap";
import Select from "react-select";
import React from "react";

const AnyOne = props => {
    let {
        actions,
        editor,
        setParentData,
        reset
    } = props;

    let [data, setData] = useState({
        action: null,
        current_process_user_is_target: false,
        same_target_on_step: null,
        same_department_on_step: null,
        disable_same_target_on_step: false,
        disable_current_process_user_is_target: false,
        disable_same_department_on_step: false
    });

    useEffect(() => {
        setData({
            action: null,
            current_process_user_is_target: false,
            same_target_on_step: null,
            same_department_on_step: null,
            disable_same_target_on_step: false,
            disable_current_process_user_is_target: false,
            disable_same_department_on_step: false
        });
    }, [reset])

    return (
        <div className={"mt-3"}>
            <Form.Group>
                <Form.Label>Hành động
                    <span className="text-danger" title="Bắt buộc">*</span>
                </Form.Label>
                <Select
                    menuPortalTarget={document.body}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                    placeholder="Hành động"
                    options={actions}
                    value={data.action}
                    onChange={option => {
                        setData({
                            ...data,
                            action: option
                        });
                        setParentData('action', {id: option.value, name: option.label})
                    }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Check
                    className="mt-3"
                    type="checkbox"
                    name="current_process_user_is_target"
                    label="Chọn người đang thực hiện làm đối tượng"
                    disabled={data.disable_current_process_user_is_target}
                    onChange={({target}) => {
                        setData({
                            ...data,
                            [target.name]: target.checked,
                            disable_same_department_on_step: target.checked,
                            disable_same_target_on_step: target.checked
                        });
                        setParentData(target.name, target.checked)
                    }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Lấy đối tượng từ bước:
                </Form.Label>
                <Select
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                    options={editor.workflow.steps.map(step => ({value: step.step_id, label: step.name}))}
                    isDisabled={data.disable_same_target_on_step}
                    onChange={option => {
                        if (!option) {
                            setParentData('same_target_on_step', null)
                            setData({
                                ...data,
                                same_target_on_step: null,
                                disable_same_department_on_step: false,
                                disable_current_process_user_is_target: false
                            });
                        } else {
                            setParentData('same_target_on_step', {id: option.value, name: option.label})
                            setData({
                                ...data,
                                same_target_on_step: option,
                                disable_same_department_on_step: true,
                                disable_current_process_user_is_target: true
                            });
                        }
                    }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Cùng phòng ban với đối tượng ở bước:
                </Form.Label>
                <Select
                    menuPortalTarget={document.body}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                    options={editor.workflow.steps.map(step => ({value: step.step_id, label: step.name}))}
                    isDisabled={data.disable_same_department_on_step}
                    onChange={option => {
                        if (!option) {
                            setParentData('same_department_on_step', null)
                            setData({
                                ...data,
                                same_department_on_step: null,
                                disable_current_process_user_is_target: false,
                                disable_same_target_on_step: false
                            });
                        } else {
                            setParentData('same_department_on_step', {id: option.value, name: option.label})
                            setData({
                                ...data,
                                same_department_on_step: option,
                                disable_current_process_user_is_target: true,
                                disable_same_target_on_step: true
                            });
                        }

                    }}
                />
            </Form.Group>
        </div>
    );
}

export default AnyOne;