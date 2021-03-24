import React, {useState, useEffect} from 'react'
import {Form} from "react-bootstrap";
import Select from "react-select";

const Position = props => {
    let {
        positions,
        actions,
        editor,
        setParentData,
        reset
    } = props;

    let [disableSelect, setDisableSelect] = useState({
        action: true
    });

    let [selectedData, setSelectedData] = useState({
        position: null,
        action: null,
        same_department_on_step: null
    });

    useEffect(() => {
        setDisableSelect({
            action: true
        });

        setSelectedData({
            position: null,
            action: null,
            same_department_on_step: null
        })
    }, [reset])


    return (
        <div className="row mt-3">
            <div className="col-12">
                <Form.Group>
                    <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn chức vụ"
                        options={positions}
                        value={selectedData.position}
                        onChange={option => {
                            setSelectedData({
                                ...selectedData,
                                position: option
                            });
                            setDisableSelect({
                                action: false
                            });
                            setParentData('position', {id: option.value, name: option.label});
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Hành động <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn"
                        options={actions}
                        isDisabled={disableSelect.action}
                        value={selectedData.action}
                        onChange={option => {
                            setSelectedData({
                                ...selectedData,
                                action: option
                            });
                            setParentData('action', {id: option.value, name: option.label});
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Cùng phòng ban với đói tượng ở bước:</Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        options={editor.workflow.steps.map(step => ({value: step.step_id, label: step.name}))}
                        onChange={option => {
                            setSelectedData({
                                ...selectedData,
                                same_department_on_step: option
                            });
                            setParentData('same_department_on_step', {id: option.value, name: option.label});
                        }}
                    />
                </Form.Group>
            </div>
        </div>
    )
}

export default Position;