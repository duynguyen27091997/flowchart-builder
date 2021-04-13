import React, {useEffect, useState} from 'react';
import {useAlert} from 'react-alert';
import {FaPlus} from "react-icons/fa";
import {Button, Form, Modal, Tab, Tabs} from "react-bootstrap";
import axios from "axios";
import _ from 'lodash';

import DepartmentPosition from "./tabs/DepartmentPosition";
import Position from "./tabs/Position";
import AnyOne from "./tabs/Anyone";
import PanelCreate from "./PanelCreate";

const Node = ({drag, urls, tableId, editor}) => {

    let defaultData = {
        name: '',
        description: '',
        department: null,
        position: null,
        action: null,
        is_first: false,
        current_process_user_is_target: false,
        same_department_on_step: null,
        same_target_on_step: null,
        not_part_of_department: true
    };

    let [showCreatePanel, setShowCreatePanel] = useState(false)
    let [stepData, setStepData] = useState(defaultData);
    let [listDataSelect, setListDataSelect] = useState({
        departments: [],
        positions: [],
        actions: [],
    });
    let [showModal, setShowModal] = useState(false);
    let [tabType, setTabType] = useState('department-position');
    let [display, setDisplay] = useState(null);
    let [reset, setReset] = useState(false);

    const getData = async () => {
        let departments = await axios.get(urls.get_list_departments);
        let positions = await axios.get(urls.get_list_positions);
        return Promise.all([departments, positions]);
    }

    useEffect(() => {
        getData().then(res => {
            let departments = res[0];
            let positions = res[1];
            setListDataSelect({
                departments: departments.data.data.map(item => ({value: item.id, label: item.dep_name})),
                positions: positions.data.data.map(item => ({value: item.id, label: item.pos_name})),
            });
        });
    }, []);

    const handleChange = (name, value, showName = null) => {
        switch (name) {
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
        setTabType('department-position');
        setShowCreatePanel(false);
        setStepData(defaultData);
        setDisplay(null);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        if (stepData.action) {
            let text = _.get(stepData, 'not_part_of_department', true) ? 'Không thuộc phòng ban nào' : 'Bất kỳ';
            setDisplay(<div className="mt-5">
                <p style={{marginBottom: 0}}><strong>Phòng
                    ban:</strong> {_.get(stepData, 'department.name', 'Bất kỳ')}</p>
                <p style={{marginBottom: 0}}><strong>Chức vụ:</strong> {_.get(stepData, 'position.name', text)}
                </p>
                <p style={{marginBottom: 5}}><strong>Hành động:</strong> {_.get(stepData, 'action.name')}</p>
                <p style={{marginBottom: 0}}><strong>Mô tả: </strong></p>
                {stepData.current_process_user_is_target &&
                <p style={{marginBottom: 0}}>Lấy người đang thực hiện làm đối tượng cụ thể</p>}
                {stepData.same_department_on_step &&
                <p style={{marginBottom: 0}}>Đối tượng có liên hệ tới bước: {stepData.same_department_on_step.name}</p>}
                {stepData.same_target_on_step &&
                <p style={{marginBottom: 0}}>Đối tượng lấy từ bước: {stepData.same_target_on_step.name}</p>}
            </div>);
        }
    }

    const handleSetStepData = (key, data) => {
        setStepData({
            ...stepData,
            [key]: data
        })
    }

    const handleTabChange = key => {
        setReset(!reset);
        setTabType(key);
        setStepData({
            ...stepData,
            department: null,
            position: null,
            action: null,
            current_process_user_is_target: false,
            connect_to_step: null,
            same_department_on: null,
            not_part_of_department: true
        });
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
                    <PanelCreate editor={editor} setShowModal={setShowModal} change={handleChange} display={display}/>
                }
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Đối tượng và hành động</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflow: 'hidden'}}>
                    <Tabs
                        activeKey={tabType}
                        onSelect={handleTabChange}>
                        <Tab eventKey="department-position" title="Đối tượng theo phòng ban - chức danh">
                            <DepartmentPosition
                                key={'department-position'}
                                departments={listDataSelect.departments}
                                positions={listDataSelect.positions}
                                url={urls.get_list_actions_by_post_dep}
                                tableId={tableId}
                                setParentData={handleSetStepData}
                                reset={reset}
                            />
                        </Tab>
                        <Tab eventKey="position" title="Đối tượng theo chức danh">
                            <Position
                                positions={listDataSelect.positions}
                                editor={editor}
                                reset={reset}
                                url={urls.get_list_actions_by_post}
                                setParentData={handleSetStepData}
                            />
                        </Tab>
                        {/*<Tab eventKey="personal" title="Đối tượng bất ký">*/}
                        {/*    <AnyOne*/}
                        {/*        editor={editor}*/}
                        {/*        reset={reset}*/}
                        {/*        setParentData={handleSetStepData}/>*/}
                        {/*</Tab>*/}
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Node;