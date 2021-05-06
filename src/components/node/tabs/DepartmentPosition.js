import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import {useAlert} from 'react-alert'
import Switch from "react-switch";


let coopApprovalOption = [
    {
        label: 'Tất cả đối tượng đều phải duyệt (thuộc phòng ban - chức vụ ở trên)',
        value: 'all_target_of_position_department'
    },
    {
        label: 'Duyệt đủ theo số lượng cho trước (đối tượng bất kỳ thuộc phòng ban - chức vụ ở trên)',
        value: 'sufficient_quantity_target_of_position_department'
    },
    {
        label: 'Chọn một số đối tượng cụ thể (thuộc phòng ban - chức vụ ở trên)',
        value: 'some_specific_target_of_position_department'
    }
];
const DepartmentPosition = props => {
    let {departments, positions, url, setParentData, reset} = props;
    let alert = useAlert();
    let [disableSelect, setDisableSelect] = useState({
        position: true,
        action: true
    });
    let [selectedData, setSelectedData] = useState({
        department: null,
        position: null,
        action: null,
        co_approval: false,
        co_approval_type: coopApprovalOption[0],
        sufficient_quantity_target_of_position_department_value: 2,
        required_to_select_specific_target: true
    });

    let [listActionByPosDep, setListActionByPosDep] = useState([]);

    const handleChange = (type, value) => {
        setSelectedData({
            ...selectedData,
            [type]: value
        });
        setParentData(type, {id: value.value, name: value.label})
    }

    const getActionData = (depart, pos) => {
        axios.get(url, {
            params: {
                dep_id: depart,
                pos_id: pos
            }
        }).then(({data}) => {
            let options = [];
            data = Object.values(data);
            if (data.length) {
                options = data.reduce((result, service) => {
                    let serviceName = service.name;
                    return [
                        ...result,
                        ...service.groups.reduce((final, group) => {
                            let fullName = `${serviceName} - ${group.name}`;
                            return [
                                ...final,
                                {
                                    label: fullName,
                                    options: group.permissions.map(per => ({value: per.id, label: per.name}))
                                }
                            ]
                        }, [])
                    ]
                }, [])
            }
            setListActionByPosDep(options);
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    }

    const formatGroupLabel = data => {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#d2d2d2',
                padding: 10,
                color: 'white',
                margin: 0,
                fontSize: 15,
                fontWeight: 800
            }}>
                <span>{data.label}</span>
                <span style={{
                    backgroundColor: '#EBECF0',
                    borderRadius: '2em',
                    color: '#172B4D',
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 'normal',
                    lineHeight: '1',
                    minWidth: 1,
                    padding: '0.16666666666667em 0.5em',
                    textAlign: 'center',
                }}>{data.options.length}</span>
            </div>
        )
    };

    const renderSelectCoopApprovalSelectType = () => {
        if (selectedData.co_approval) {
            return <Form.Group>
                <Form.Label>Loại đồng duyệt <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                <Select
                    menuPortalTarget={document.body}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                    placeholder="Loại dồng duyệt"
                    options={coopApprovalOption}
                    value={selectedData.co_approval_type}
                    onChange={option => {
                        setSelectedData({
                            ...selectedData,
                            co_approval_type: option
                        });
                        setParentData('co_approval.type', option.value)
                    }}
                />
            </Form.Group>
        }
        return null;
    }

    const renderCoApprovalMetaData = () => {
        if (selectedData.co_approval_type) {
            switch (selectedData.co_approval_type.value) {
                case 'sufficient_quantity_target_of_position_department': {
                    return <Form.Group className="mt-3">
                        <Form.Label>Nhập số lượng đói tượng đồng duyệt
                            <span className="text-danger" title="Bắt buộc">*</span>
                        </Form.Label>
                        <Form.Control
                            name="name"
                            type="number"
                            value={selectedData.sufficient_quantity_target_of_position_department_value}
                            onChange={({target}) => {
                                setSelectedData({
                                    ...selectedData,
                                    sufficient_quantity_target_of_position_department_value: target.value
                                })
                                setParentData('co_approval.sufficient_quantity_target_of_position_department_value', target.value)
                            }}
                            min={2}/>
                    </Form.Group>
                }
            }
        }

        return null;
    }

    useEffect(() => {
        setDisableSelect({
            position: true,
            action: true
        });

        setSelectedData({
            department: null,
            position: null,
            action: null,
            co_approval: false,
            co_approval_type: coopApprovalOption[0],
            sufficient_quantity_target_of_position_department_value: 2,
            required_to_select_specific_target: true
        });

        setListActionByPosDep([]);

    }, [reset])

    return (
        <div className="row">
            <div className="col-12">
                <Form.Group>
                    <Form.Label>Phòng ban <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn phòng ban"
                        options={departments}
                        value={selectedData.department}
                        onChange={option => {
                            setDisableSelect({
                                ...disableSelect,
                                position: false,
                                action: true
                            })
                            handleChange('department', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn chức vụ"
                        options={positions}
                        isDisabled={disableSelect.position}
                        value={selectedData.position}
                        onChange={option => {
                            setDisableSelect({
                                ...disableSelect,
                                action: false
                            })
                            getActionData(selectedData.department.value, option.value);
                            handleChange('position', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Hành động <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        formatGroupLabel={formatGroupLabel}
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Hành động"
                        value={selectedData.action}
                        options={listActionByPosDep}
                        isDisabled={disableSelect.action}
                        onChange={option => handleChange('action', option)}
                    />
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={selectedData.co_approval}
                                onChange={(checked) => {
                                    let tmp = {
                                        ...selectedData,
                                        required_to_select_specific_target: checked
                                    };
                                    setSelectedData(tmp);
                                    setParentData('required_to_select_specific_target', checked)
                                }}
                                checked={selectedData.required_to_select_specific_target}/>
                        <span className={"pl-2"}>Bắt buộc chọn đối tượng cụ thể</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={selectedData.required_to_select_specific_target}
                                onChange={(checked) => {
                                    let tmp = {
                                        ...selectedData,
                                        required_to_select_specific_target: false,
                                        co_approval: checked
                                    };
                                    if (!checked) {
                                        tmp.co_approval_type = coopApprovalOption[0];
                                        tmp.sufficient_quantity_target_of_position_department_value = 2;
                                    }
                                    setSelectedData(tmp)
                                    setParentData('co_approval.enable', checked)
                                }}
                                checked={selectedData.co_approval}/>
                        <span className={"pl-2"}>Đồng duyệt?</span>
                    </label>
                </Form.Group>
                {renderSelectCoopApprovalSelectType()}
                {renderCoApprovalMetaData()}
            </div>
        </div>
    )
}

export default DepartmentPosition;