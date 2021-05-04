import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import {useAlert} from 'react-alert'

const DepartmentPosition = props => {
    let {
        departments,
        positions,
        url,
        tableId,
        setParentData,
        reset,
        allActions
    } = props;

    let alert = useAlert();

    let [disableSelect, setDisableSelect] = useState({
        position: true,
        action: true
    });

    let [selectedData, setSelectedData] = useState({
        department: null,
        position: null,
        action: null,
        current_process_user_is_target: false
    });

    let [listActionByPosDep, setListActionByPosDep] = useState([]);

    useEffect(() => {
        setDisableSelect({
            position: true,
            action: true
        });

        setSelectedData({
            department: null,
            position: null,
            action: null,
            current_process_user_is_target: false
        });

        setListActionByPosDep([]);

    }, [reset])

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

    const formatGroupLabel = data => (
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
    );

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
                    <Form.Check
                        className="mt-3"
                        type="checkbox"
                        name="current_process_user_is_target"
                        label="Chọn người đang tạo tài liệu làm đối tượng cho bước này"
                        checked={selectedData.current_process_user_is_target}
                        onChange={({target}) => {
                            setSelectedData({
                                ...selectedData,
                                current_process_user_is_target: target.checked
                            });
                            setParentData('current_process_user_is_target', target.checked)
                        }}
                    />
                </Form.Group>
            </div>
        </div>
    )
}

export default DepartmentPosition;