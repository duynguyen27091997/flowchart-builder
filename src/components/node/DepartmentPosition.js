import React, {useContext, useEffect, useState} from 'react';
import {Form, Button} from "react-bootstrap";
import Select from "react-select";
import md5 from 'md5';
import FlowContext from "../../flow-context";
import Switch from "react-switch";

const DepartmentPosition = ({setParentData, showModalTarget}) => {
    let {departments, positions} = useContext(FlowContext);

    let [targets, setTargets] = useState({});
    let [useCreatorDepartment, setUseCreatorDepartment] = useState(false);
    let [currentProcessTarget, setCurrentProcessTarget] = useState({
        department: null,
        position: null
    });
    let [disableDepartmentSelect, setDisableDepartmentSelect] = useState(false);

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
        setDisableDepartmentSelect(false)
    }

    const deleteTarget = key => {
        let targetsData = JSON.parse(JSON.stringify(targets));
        delete targetsData[key]
        if (Object.values(targetsData).find(target => !target.department) === undefined) {
            setUseCreatorDepartment(false);
        }
        setTargets({...targetsData});
    }

    useEffect(() => {
        setParentData({targets: JSON.parse(JSON.stringify(targets))});
    }, [targets]);

    useEffect(() => {
        if (useCreatorDepartment) {
            setCurrentProcessTarget({
                ...currentProcessTarget,
                department: null
            });
            setDisableDepartmentSelect(true);
            setParentData({use_creator_department: true})
        } else {
            setDisableDepartmentSelect(false);
            setParentData({use_creator_department: false})
        }
    }, [useCreatorDepartment]);

    useEffect(() => {
        if (showModalTarget) {
            setCurrentProcessTarget({
                department: null,
                position: null
            });
            setTargets({});
            setDisableDepartmentSelect(false);
            setUseCreatorDepartment(false)
        }
    }, [showModalTarget])

    return (
        <div className="row mt-2">
            <div className="col-md-7 col-sm-12">
                <div className="border" style={{padding: 10, backgroundColor: 'rgb(128 128 128 / 6%)'}}>
                    <h5 style={{fontWeight: 700}}>Chọn đối tượng</h5>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <Form.Group>
                                <Form.Label>Phòng ban</Form.Label>
                                <Select
                                    menuPortalTarget={document.body}
                                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                    placeholder="Chọn phòng ban"
                                    options={departments.map(department => ({
                                        value: department.id,
                                        label: department.dep_name
                                    }))}
                                    isDisabled={disableDepartmentSelect}
                                    isClearable={true}
                                    value={currentProcessTarget?.department}
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
                                <Form.Label>Chức vụ <span className="text-danger"
                                                          title="Bắt buộc">*</span></Form.Label>
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
                        <div className="col-md-12 col-sm-12">
                            <Form.Group>
                                <label className={"d-flex align-items-center"}>
                                    <Switch height={20}
                                            width={45}
                                            disabled={
                                                (currentProcessTarget.position !== null && currentProcessTarget.department !== null)
                                                || Object.values(targets).find(target => !target.department) !== undefined
                                            }
                                            onChange={checked => setUseCreatorDepartment(checked)}
                                            checked={useCreatorDepartment}/>
                                    <span className={"pl-2"}>Dùng phòng ban của người tạo tài liệu cho chức vụ</span>
                                </label>
                            </Form.Group>
                        </div>
                        <div className="col-md-2 col-sm-12 d-flex justify-content-center align-items-center">
                            <button
                                className="btn btn-success"
                                onClick={addTarget}
                                disabled={
                                    (!useCreatorDepartment && (!currentProcessTarget.department || !currentProcessTarget.position))
                                    || (!currentProcessTarget.position && useCreatorDepartment)
                                }>
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

export default DepartmentPosition;
