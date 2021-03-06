import React, {useEffect, useState} from "react";
import useFlowChart from "../../hooks/useFlowChart";
import "./FlowChart.scss";

import axios from "axios";
import Node from "../node/Node";
import FlowTool from "../flow-tool/FlowTool";
import {AiOutlineSelect} from "react-icons/ai";
import FlowList from "../flow-list/FlowList";
import {useAlert} from 'react-alert'
import {Button, Modal} from "react-bootstrap";

const FlowChart = props => {
    let {
        urls,
        user,
        permissions = []
    } = props;

    let alert = useAlert();
    let [editor, drag, drop, allowDrop] = useFlowChart();
    let [showModal, setShowModal] = useState(false);
    let [listDocumentTypes, setListDocumentTypes] = useState([]);
    let [documentType, setDocumentType] = useState(null);

    const onClickSelectDocumentType = item => {
        axios.get(urls.get_workflow_detail, {params: {type_id: item.id}})
            .then(
                ({status, data}) => {
                    setDocumentType(item)
                    editor.import(data);
                }
            )
            .catch(() => {
                editor.clear()
                alert.show('Không tìm thấy dữ liệu, Tiến hành tạo mới');
                setDocumentType(item);
            })
            .finally(() => {
                setShowModal(false);
            })
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }
    const renderType = type => {
        return <div className={'mt-5 mb-5 text-center'}>
            <p>Loại tài liệu</p>
            <p className={'font-weight-bold'}>{type.display_name} </p>
        </div>
    }
    const getData = async () => {
        return axios.get(urls.get_list_document_types);
    }

    useEffect(() => {
        getData().then(({status, data}) => {
            if (status === 200) setListDocumentTypes(data);
        });
    }, []);

    useEffect(() => {
        editor && editor.start();
    }, [editor]);

    const handleSave = steps => {
        let data = {
            steps: steps.steps,
            workflow_pos_x: editor.canvas_x,
            workflow_pos_y: editor.canvas_y,
            creator_id: user?.id,
            creator_name: user?.name
        };
        axios.post(urls.store_work_flow + '/' + documentType.id, data)
            .then(res => {
                alert.show('Lưu thành công');
            })
            .catch(err => {
                alert.show('Có lỗi xảy ra');
            });
    };

    const checkPermission = action => {
        return permissions.find(permission => permission.action.toLowerCase() === action) !== undefined
    }


    const renderFlow = () => {
        return <div className={"flow"}>
            <aside className="flow__sidebar">
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="dark" onClick={() => setShowModal(true)}>
                        <AiOutlineSelect size={"25"}/> Chọn loại tài liệu
                    </Button>
                </div>
                {documentType && renderType(documentType)}
                {documentType && <Node urls={urls} drag={drag} editor={editor}/>}
                <FlowTool editor={editor} handleSave={handleSave} permissions={permissions}
                          checkPermission={checkPermission}/>
            </aside>
            <main id={"draw-main"} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chọn loại tài liệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FlowList list={listDocumentTypes} clickHandle={onClickSelectDocumentType}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
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

    return (
        checkPermission('view') ? renderFlow() : renderNoAccess()
    );
};

export default FlowChart;