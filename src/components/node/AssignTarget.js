import React, {useContext, useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import md5 from 'md5';
import FlowContext from "../../flow-context";

const AssignTarget = ({setParentData, stepData}) => {
    let {positions} = useContext(FlowContext);

    let [assignDescription, setAssignDescription] = useState(null);
    let [targets, setTargets] = useState({});
    let [currentProcessTarget, setCurrentProcessTarget] = useState({
        department: null,
        position: null
    });

    const addTarget = () => {
        setTargets({
            ...targets,
            [md5(JSON.stringify({
                department_id: currentProcessTarget.department?.value,
                position_id: currentProcessTarget.position.value,
            }))]: JSON.parse(JSON.stringify(currentProcessTarget))
        });
        setCurrentProcessTarget({
            department: null,
            position: null
        });
    }

    const deleteTarget = key => {
        let targetsData = JSON.parse(JSON.stringify(targets));
        delete targetsData[key]
        setTargets({...targetsData});
    }

    useEffect(() => {
        setParentData({assign_targets: JSON.parse(JSON.stringify(targets))});
    }, [targets])

    useEffect(() => {
        setParentData({assign_description: assignDescription});
    }, [assignDescription])

    return (
        <div className="row mt-2">
            <div className="col-md-7 col-sm-12">
                <div className="border" style={{padding: 10, backgroundColor: 'rgb(128 128 128 / 6%)'}}>
                    <h5 style={{fontWeight: 700}}>Mô tả phân công</h5>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Mô tả phân công"
                                    value={assignDescription}
                                    onChange={event => setAssignDescription(event.target.value)}/>
                            </Form.Group>
                        </div>
                    </div>
                    <h5 style={{fontWeight: 700}}>Chọn đối tượng</h5>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <Form.Group>
                                <Form.Label>Phòng ban</Form.Label>
                                <Select
                                    menuPortalTarget={document.body}
                                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                    placeholder="Chọn phòng ban"
                                    options={Object.values(stepData.targets).filter(target => target.department).map(target => ({
                                        label: target.department.label,
                                        value: target.department.value
                                    }))}
                                    isDisabled={!Object.values(stepData.targets).filter(target => target.department).length || stepData.use_creator_department}
                                    isClearable={true}
                                    value={currentProcessTarget.department}
                                    onChange={option => {
                                        setCurrentProcessTarget(current => {
                                            current = {
                                                ...(current ? current : {}),
                                                department: option ? {
                                                    ...option
                                                } : null
                                            }
                                            return current;
                                        })
                                    }}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <Form.Group>
                                <Form.Label>
                                    Chức vụ
                                    <span className="text-danger" title="Bắt buộc">*</span>
                                </Form.Label>
                                <Select
                                    menuPortalTarget={document.body}
                                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                    placeholder="Chọn chức vụ"
                                    options={positions.map(position => ({
                                        value: position.id,
                                        label: position.pos_name
                                    }))}
                                    value={currentProcessTarget?.position}
                                    onChange={option => {
                                        setCurrentProcessTarget(current => {
                                            current = {
                                                ...(current ? current : {}),
                                                position: {
                                                    ...option
                                                }
                                            }
                                            return current;
                                        })
                                    }}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-2 col-sm-12 d-flex justify-content-center align-items-center">
                            <button
                                className="btn btn-success"
                                onClick={addTarget}>
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-5 col-sm-12">
                <h5 style={{fontWeight: 700}}>Đối tượng đã thêm</h5>
                <div style={{maxHeight: 500, overflowY: 'scroll', overflowX: 'hidden'}}>
                    {Object.keys(targets).map(key => (
                        <div key={key} className="alert alert-secondary alert-dismissible fade show" role="alert">
                            {targets[key].department?.label} {targets[key].position.label}
                            <button type="button" className="close" data-dismiss="alert"
                                    onClick={() => deleteTarget(key)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AssignTarget;
