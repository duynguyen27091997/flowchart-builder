import React, {useEffect, useState} from 'react';
import {useAlert} from 'react-alert';
import {FaPlus} from "react-icons/fa";
import {Button, Form} from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";

const Node = ({drag, urls, tableId}) => {

    let defaultData = {
        name: '',
        description: '',
        department: null,
        position: null,
        action: null,
        is_first: false
    };
    let alert = useAlert();
    let [showCreatePanel, setShowCreatePanel] = useState(false)
    let [stepData, setStepData] = useState(defaultData);
    let [listDataSelect, setListDataSelect] = useState({
        departments: [],
        positions: [],
        actions: []
    });
    let [selectedData, setSelectedData] = useState({
        department: null,
        position: null,
        action: null
    });
    let [disableSelect, setDisableSelect] = useState({
        position: true,
        action: true
    })


    const getDepartmentData = () => {
        !listDataSelect.departments.length > 0 && axios.get(urls.get_list_departments).then(
            ({data}) => {
                setListDataSelect({
                    ...listDataSelect,
                    departments: data.data.map(item => ({value: item.id, label: item.dep_name}))
                })
            },
            err => {
                alert.show('Có lỗi xyar ra')
            }
        )
    }

    const getPositionData = (id) => {
        !listDataSelect.positions.length > 0 && axios.get(urls.get_list_positions).then(
            ({data}) => {
                setListDataSelect({
                    ...listDataSelect,
                    positions: data.data.map(item => ({value: item.id, label: item.pos_name}))
                });
            },
            err => {
                alert.show('Có lỗi xảy ra');
                setDisableSelect({...disableSelect, position: true, action: true});
            }
        )
    }

    const getActionData = (depart, pos) => {
        axios.get(urls.get_list_actions, {
            params: {
                dep_id: depart,
                pos_id: pos,
                table_id: tableId
            }
        }).then(({data}) => {
            setListDataSelect({
                ...listDataSelect,
                actions: data.map(item => ({value: item.id, label: item.name}))
            });
            setDisableSelect({...disableSelect, action: false})
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    }

    const randomNum = (Min, Max) => {
        let Range = Max - Min;
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    useEffect(() => {
        getDepartmentData();
    }, []);

    const handleChange = (name, value, showName = null) => {
        switch (name) {
            case 'department': {
                setStepData({
                    ...stepData,
                    department: {
                        id: value.value,
                        name: value.label
                    }
                })
                setSelectedData({...selectedData, department: value, position: null, action: null});
                setDisableSelect({...disableSelect, position: false, action: true});
                getPositionData(value.value);
                break;
            }
            case 'position': {
                setStepData({
                    ...stepData,
                    position: {
                        id: value.value,
                        name: value.label
                    }
                })
                setSelectedData({...selectedData, position: value});
                getActionData(selectedData.department.value, value.value)
                break;
            }
            case 'action': {
                setStepData({
                    ...stepData,
                    action: {
                        id: value.value,
                        name: value.label
                    }
                });
                setSelectedData({...selectedData, action: value});
                break;
            }
            case 'is_first': {
                setStepData({
                    ...stepData,
                    is_first: value
                })
            }
            default:
                setStepData({...stepData, [name]: value})
                break;
        }
    }
    const resetPanelCreate = () => {
        setShowCreatePanel(false);
        setStepData(defaultData);
        setSelectedData({
            department: null,
            position: null,
            action: null
        });
        setDisableSelect({
            position: true,
            action: true
        })
    }

    return (
        <div>
            <div className="node"
                 draggable={showCreatePanel}
                 onDragEnd={resetPanelCreate}
                 onDragStart={event => drag(stepData, event)}>
                {!showCreatePanel ?
                    <Button
                        variant="outline-dark"
                        style={{width: '100%'}}
                        onClick={() => setShowCreatePanel(true)}>
                        <FaPlus/> Tạo step
                    </Button> :
                    <div style={{padding: "10px", border: '1px solid black'}}>
                        <Form.Group>
                            <Form.Label>Tên <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                            <Form.Control
                                name="name"
                                type="text"
                                placeholder="Tên"
                                onChange={({target}) => handleChange(target.name, target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                name="description"
                                placeholder="Mô tả"
                                as="textarea"
                                rows={3}
                                onChange={({target}) => handleChange(target.name, target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Phòng ban <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                            <Select
                                name="department"
                                placeholder="Chọn phòng ban"
                                options={listDataSelect.departments}
                                onChange={option => handleChange('department', option)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                            <Select
                                name="position"
                                placeholder="Chọn chức vụ"
                                isDisabled={disableSelect.position}
                                options={listDataSelect.positions}
                                value={selectedData.position}
                                onChange={option => handleChange('position', option)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Hành động <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                            <Select
                                name="action"
                                placeholder="Hành động"
                                isDisabled={disableSelect.action}
                                options={listDataSelect.actions}
                                value={selectedData.action}
                                onChange={option => handleChange('action', option)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="is_first"
                                type="checkbox"
                                label="Step đầu"
                                onChange={({target}) => handleChange(target.name, target.checked)}/>
                        </Form.Group>
                    </div>
                }
            </div>
        </div>
    );
};

export default Node;