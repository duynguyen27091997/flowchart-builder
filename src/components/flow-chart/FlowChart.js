import React, {useEffect, useState, useContext} from "react";
import useFlowChart from "../../hooks/useFlowChart";
import FlowContext from "../../flow-context";
import {canDo} from '../../helpers/permission'
import "./FlowChart.scss";

import axios from "axios";
import Node from "../node/Node";
import FlowTool from "../flow-tool/FlowTool";
import {AiOutlineSelect} from "react-icons/ai";
import ListDocumentType from "../list-document-type/ListDocumentType";
import {useAlert} from 'react-alert'
import {Button, Modal} from "react-bootstrap";

const FlowChart = () => {
    const {
        document_types = [],
        getWorkflowHandle,
        permissions,
        setEditor,
        setDrag,
        onSave,
        onWorkflowNotFound
    } = useContext(FlowContext)

    let alert = useAlert();
    let [editor, drag, drop, allowDrop] = useFlowChart();
    let [modalSelectDocumentType, setModalSelectDocumentType] = useState(false);
    let [documentType, setDocumentType] = useState(null);

    const onSelectDocumentType = async item => {
        editor.workflow = null;
        let workflow = await getWorkflowHandle(item.id);
        if (workflow) {
            editor.import(workflow);
        } else {
            editor.clear()
            if (onWorkflowNotFound) {
                onWorkflowNotFound(item)
            } else {
                alert.show('Không tìm thấy dữ liệu, tiến hành tạo mới.');
            }
        }
        setDocumentType(item);
        setModalSelectDocumentType(false);
    }

    useEffect(() => {
        setEditor(editor);
        editor && editor.start();
    }, [editor]);

    const handleSave = () => {
        let data = {
            steps: editor.export().steps,
            workflow_pos_x: editor.canvas_x,
            workflow_pos_y: editor.canvas_y,
        };
        if (!onSave) {
            throw new Error('onSave handler is not provided')
        }
        onSave(documentType.id, data)
    };

    const renderFlow = () => {
        return <div className={"flow"}>
            <aside className="flow__sidebar">
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="dark" onClick={() => setModalSelectDocumentType(true)}>
                        <AiOutlineSelect size={"25"}/> Chọn loại tài liệu
                    </Button>
                </div>
                {
                    documentType &&
                    <div>
                        <div className={'mt-5 mb-5 text-center'}>
                            <p className={'font-weight-bold'}>{documentType.display_name} </p>
                        </div>
                        <Node drag={drag}/>
                    </div>
                }
                <FlowTool onSave={handleSave}/>
            </aside>
            <main id={"draw-main"} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
            <Modal show={modalSelectDocumentType} onHide={() => setModalSelectDocumentType(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chọn loại tài liệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListDocumentType documentTypes={document_types} onSelect={onSelectDocumentType}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalSelectDocumentType(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }

    const renderNoAccess = () => {
        return <div className='card'>
            <div className='card-body d-flex justify-content-center align-items-center'>
                <h5 className='text-center font-weight-bold'>Không có quyền truy cập</h5>
            </div>
        </div>
    }

    return canDo('view', permissions) ? renderFlow() : renderNoAccess();
};

export default FlowChart;
