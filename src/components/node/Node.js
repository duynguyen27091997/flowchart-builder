import React, {useEffect, useState} from 'react';
import {useAlert} from 'react-alert';
import {FaPlus} from "react-icons/fa";
import {Button, Form, Modal, Tab, Tabs} from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import _ from 'lodash';

const Node = ({drag, urls, tableId, editor}) => {

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
        action: null,
        type: null
    });
    let [disableSelect, setDisableSelect] = useState({
        position: true,
        action: true
    });
    let [showModal, setShowModal] = useState(false);
    let [tabType, setTabType] = useState('department-position');
    let [display, setDisplay] = useState(null);
    let [dataAction, setDataAction] = useState([]);


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
                actions: data.map(item => ({value: item.id, label: item.note}))
            });
            setDisableSelect({...disableSelect, action: false})
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    }

    useEffect(() => {
        getDepartmentData();
        dataAction.length === 0 && axios.get('https://employee.tuoitre.vn/api/action').then(
            res => {
                setDataAction(res.data.data.map(item => ({value: item.id, label: item.note})))
            }
        )
    }, []);

    const isHasFirstStep = () => editor.workflow.steps.find(item => item.is_first) !== undefined

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
        });
        setDisplay(null);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        if (selectedData.action) {
            setDisplay(<div className="mt-5">
                <p style={{marginBottom: 0}}><strong>Phòng ban:</strong> {_.get(selectedData, 'department.label', 'Bất kỳ')}</p>
                <p style={{marginBottom: 0}}><strong>Chức vụ:</strong> {_.get(selectedData, 'position.label', 'Bất kỳ')}</p>
                <p style={{marginBottom: 0}}><strong>Hành động:</strong> {_.get(selectedData, 'action.label')}</p>
            </div>);
        }
    }

    return (
        <div>
            <div className="node"
                 draggable={showCreatePanel}
                 onDragEnd={resetPanelCreate}
                 onDragStart={event => drag({...stepData, mode: tabType}, event)}>
                {!showCreatePanel ?
                    <Button
                        variant="outline-dark"
                        style={{width: '100%'}}
                        onClick={() => setShowCreatePanel(true)}>
                        <FaPlus/> Tạo step
                    </Button> :
                    <div style={{padding: "10px", border: '1px solid black'}}>
                        <h5 className="card-title">Thông tin step</h5>
                        <Form.Group className="mt-3">
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
                        <Button variant="outline-dark" onClick={() => setShowModal(true)}>
                            Thêm đói tượng và hành động
                        </Button>
                        {display}
                        {
                            !isHasFirstStep() && <Form.Group>
                                <Form.Check
                                    className="mt-3"
                                    name="is_first"
                                    type="checkbox"
                                    label="Step đầu"
                                    onChange={({target}) => handleChange(target.name, target.checked)}/>
                            </Form.Group>
                        }
                    </div>
                }
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Đối tượng và hành động</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflow: 'hidden'}}>
                    <Tabs
                        activeKey={tabType}
                        onSelect={(k) => setTabType(k)}
                    >
                        <Tab eventKey="department-position" title="Đối tượng theo phòng ban - chức vụ">
                            <div className="row">
                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Phòng ban <span className="text-danger"
                                                                    title="Bắt buộc">*</span></Form.Label>
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            name="department"
                                            placeholder="Chọn phòng ban"
                                            options={listDataSelect.departments}
                                            onChange={option => handleChange('department', option)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Chức vụ <span className="text-danger"
                                                                  title="Bắt buộc">*</span></Form.Label>
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            name="position"
                                            placeholder="Chọn chức vụ"
                                            isDisabled={disableSelect.position}
                                            options={listDataSelect.positions}
                                            value={selectedData.position}
                                            onChange={option => handleChange('position', option)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Hành động <span className="text-danger"
                                                                    title="Bắt buộc">*</span></Form.Label>
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            name="action"
                                            placeholder="Hành động"
                                            isDisabled={disableSelect.action}
                                            options={listDataSelect.actions}
                                            value={selectedData.action}
                                            onChange={option => handleChange('action', option)}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="personal" title="Đối tượng bất ký">
                            <Form.Group>
                                <Form.Label>Hành động <span className="text-danger"
                                                            title="Bắt buộc">*</span></Form.Label>
                                <Select
                                    menuPortalTarget={document.body}
                                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                    placeholder="Hành động"
                                    options={dataAction}
                                    value={selectedData.action}
                                    onChange={option => handleChange('action', option)}
                                />
                            </Form.Group>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Node;