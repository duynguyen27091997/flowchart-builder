import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";

import PanelCreate from "./PanelCreate";
import DepartmentPosition from "./DepartmentPosition";
import AssignTarget from "./AssignTarget";
import FlowContext from "../../flow-context";

const Node = ({drag}) => {
    let {editor} = useContext(FlowContext);

    let [stepData, setStepData] = useState({
        name: null,
        description: null,
        targets: {},
        is_first: editor.workflow.steps.length === 0,
        use_creator_department: false,
        assign_targets: {},
        assign_description: null
    });


    useEffect(()=>{
        stepData.is_first = editor.workflow.steps.length === 0
    }, [editor])

    let [showModalTarget, setShowModalTarget] = useState(false);
    let [showModalAssign, setShowModalAssign] = useState(false);

    const resetPanelCreate = () => {
        setStepData({
            name: null,
            description: null,
            targets: {},
            is_first: editor.workflow.steps.length === 0,
            use_creator_department: false,
            assign_targets: {},
            assign_description: null
        });
    }

    const handleSetStepData = data => {
        setStepData({...stepData, ...data});
    }

    return (<div>
        <div
            className="node"
            draggable={true}
            onDragEnd={resetPanelCreate}
            onDragStart={event => drag({...stepData}, event)}>
            <PanelCreate
                setShowModalTarget={setShowModalTarget}
                setShowModalAssign={setShowModalAssign}
                setNodeData={handleSetStepData}
                stepData={stepData}/>
        </div>
        <Modal
            show={showModalTarget}
            onHide={() => setShowModalTarget(false)}
            size="xl"
            backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Đối tượng và hành động</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow: 'hidden'}}>
                <DepartmentPosition
                    showModalTarget={showModalTarget}
                    setParentData={handleSetStepData}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModalTarget(false)}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal
            show={showModalAssign}
            onHide={() => setShowModalAssign(false)}
            size="xl"
            backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Đối tượng phân công</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow: 'hidden'}}>
                <AssignTarget stepData={stepData} setParentData={handleSetStepData}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModalAssign(false)}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    </div>)
}

export default Node;
