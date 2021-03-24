import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

const DepartmentPosition = props => {
    let {
        departments,
        positions,
        url,
        tableId,
        setParentData,
        reset
    } = props;

    let [disableSelect, setDisableSelect] = useState({
        position: true,
        action: true
    });

    let [selectedData, setSelectedData] = useState({
        department: null,
        position: null,
        action: null
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
            action: null
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
                pos_id: pos,
                table_id: tableId
            }
        }).then(({data}) => {
            setListActionByPosDep(data.map(item => ({value: item.id, label: item.note})));
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    }

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
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Hành động"
                        value={selectedData.action}
                        options={listActionByPosDep}
                        isDisabled={disableSelect.action}
                        onChange={option => handleChange('action', option)}
                    />
                </Form.Group>
            </div>
        </div>
    )
}

export default DepartmentPosition;