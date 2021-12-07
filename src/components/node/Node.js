import React, {useEffect, useState} from 'react';
import {FaPlus} from "react-icons/fa";
import {Button, Modal, Tab, Tabs} from "react-bootstrap";
import axios from "axios";

import PanelCreate from "./PanelCreate";
import DepartmentPosition from "./modal/tabs/DepartmentPosition";
import Position from "./modal/tabs/Position";
import ChargeOfOpinion from "./modal/ChargeOfOpinion";

let defaultStepData = {
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
    },
    charge_of_opinion: {
        enable: false,
        department: null,
        position: null,
        number_of_charge: 1,
            use_document_creator_department_for_position: false
    }
};

const Node = ({drag, urls, editor}) => {

    let [showCreatePanel, setShowCreatePanel] = useState(false)
    let [stepData, setStepData] = useState(defaultStepData);
    let [listDataSelect, setListDataSelect] = useState({departments: [], positions: [], actions: [],});
    let [modalTargetAction, setModalTargetAction] = useState(false);
    let [modalOpinion, setModalOpinion] = useState(false);
    let [tabType, setTabType] = useState('department_position');
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

    const resetPanelCreate = () => {
        setTabType('department_position');
        setShowCreatePanel(false);
        setStepData(defaultStepData);
    }

    const handleSetStepData = data => {
        setStepData({
            ...stepData,
            ...data
        });
    }

    const handleTabChange = key => {
        if (key !== tabType) {
            setReset(!reset);
            setTabType(key);
            setStepData({
                ...defaultStepData,
                name: stepData.name,
                description: stepData.description,
                is_first: stepData.is_first,
                charge_of_opinion: stepData.charge_of_opinion
            });
        }
    }

    return (
        <div>
            <div className="node" draggable={showCreatePanel} onDragEnd={resetPanelCreate}
                 onDragStart={event => drag({...stepData, mode: tabType}, event)}>
                {!showCreatePanel ?
                    <Button
                        variant="outline-dark"
                        style={{width: '100%'}}
                        onClick={() => setShowCreatePanel(true)}>
                        <FaPlus/> Tạo step
                    </Button> :
                    <PanelCreate
                        editor={editor}
                        setModalTargetAction={setModalTargetAction}
                        setModalOpinion={setModalOpinion}
                        setNodeData={handleSetStepData}
                        stepData={stepData}/>
                }
            </div>
            <Modal show={modalTargetAction} onHide={() => setModalTargetAction(false)} size="lg" backdrop="static">
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
                    <Button variant="secondary" onClick={() => setModalTargetAction(false)}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalOpinion} onHide={() => setModalOpinion(false)} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Phụ trách ý kiến</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflow: 'hidden'}}>
                    <ChargeOfOpinion
                        setParentData={handleSetStepData}
                        departments={listDataSelect.departments}
                        positions={listDataSelect.positions}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalOpinion(false)}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Node;
