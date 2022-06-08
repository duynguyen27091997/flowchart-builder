import React, {useContext, useState} from 'react';
import {Button, Modal} from "react-bootstrap";

import PanelCreate from "./PanelCreate";
import DepartmentPosition from "./DepartmentPosition";
import FlowContext from "../../flow-context";

const Node = ({drag}) => {
    let {editor} = useContext(FlowContext);

    let [stepData, setStepData] = useState({
        name: null,
        description: null,
        targets: {},
        is_first: editor.workflow.steps.length === 0,
        use_creator_department: false,
    });

    let [showModalTarget, setShowModalTarget] = useState(false);
    let [reset, setReset] = useState(false);

    const resetPanelCreate = () => {
        setStepData({
            name: null,
            description: null,
            targets: {},
            is_first: editor.workflow.steps.length === 0,
            use_document_creator_department_for_position: false,
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
        </div>)
}

export default Node;
