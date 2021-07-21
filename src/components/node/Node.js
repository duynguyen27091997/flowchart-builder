import React, {useEffect, useState} from 'react';
import {FaPlus} from "react-icons/fa";
import {Button, Form, Modal, Tab, Tabs} from "react-bootstrap";
import axios from "axios";
import _ from 'lodash';

import DepartmentPosition from "./tabs/DepartmentPosition";
import Position from "./tabs/Position";
import AnyOne from "./tabs/Anyone";
import PanelCreate from "./PanelCreate";

const Node = ({drag, urls, editor}) => {

    let [showCreatePanel, setShowCreatePanel] = useState(false)
    let [stepData, setStepData] = useState({
        name: null,
        description: null,
        department: null,
        position: null,
        action: null,
        is_first: false,
        use_document_creator_as_step_target: false,
        required_to_select_specific_target: false,
        use_document_creator_department_for_position: false,
        co_approval: {
            enable: false,
            type: null
        }
    });
    let [listDataSelect, setListDataSelect] = useState({departments: [], positions: [], actions: [],});
    let [showModal, setShowModal] = useState(false);
    let [tabType, setTabType] = useState('department_position');
    let [display, setDisplay] = useState(false);
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
        setTabType('department_position');
        setShowCreatePanel(false);
        setStepData({
            name: null,
            description: null,
            department: null,
            position: null,
            action: null,
            is_first: false,
            use_document_creator_as_step_target: false,
            required_to_select_specific_target: false,
            use_document_creator_department_for_position: false,
            co_approval: {
                enable: false,
                type: null
            }
        });
        setDisplay(false);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        if (stepData.action) {
            setDisplay(true);
        }
    }

    const handleSetStepData = data => {
        setStepData({
            ...stepData,
            ...data
        });
    }

    const handleTabChange = key => {
        if(key !== tabType){
            setReset(!reset);
            setTabType(key);
            setStepData({
                ...stepData,
                department: null,
                position: null,
                action: null,
                current_process_user_is_target: false,
                same_department_on_step: null,
                same_target_on_step: null,
                use_document_creator_department_for_position: true,
                required_to_select_specific_target: false,
                co_approval: {
                    enable: false,
                    type: null,
                    approval_target_nums: 2
                }
            });
        }
    }

    return (
        <div>
            <div className="node" draggable={showCreatePanel} onDragEnd={resetPanelCreate} onDragStart={event => drag({...stepData, mode: tabType}, event)}>
                {!showCreatePanel ?
                    <Button
                        variant="outline-dark"
                        style={{width: '100%'}}
                        onClick={() => setShowCreatePanel(true)}>
                        <FaPlus/> Tạo step
                    </Button> :
                    <PanelCreate editor={editor} setShowModal={setShowModal} change={handleChange} display={display} stepData={stepData}/>
                }
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Đối tượng và hành động</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflow: 'hidden'}}>
                    <Tabs
                        activeKey={tabType}
                        onSelect={handleTabChange}>
                        <Tab eventKey="department_position" title="Đối tượng theo phòng ban - chức danh">
                            <DepartmentPosition
                                key={'department-position'}
                                departments={listDataSelect.departments}
                                positions={listDataSelect.positions}
                                url={urls.get_list_actions_by_post_dep}
                                setParentData={handleSetStepData}
                                editor={editor}
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
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Node;