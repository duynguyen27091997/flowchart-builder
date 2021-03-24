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
import StepWizard from 'react-step-wizard';
import Step from '../Step'

const FlowChart = props => {
    let {
        urls,
        tableId
    } = props;

    let alert = useAlert();
    let [editor, drag, drop, allowDrop] = useFlowChart();
    let [showModal, setShowModal] = useState(false);
    let [listDocumentTypes, setListDocumentTypes] = useState([]);
    let [documentType, setDocumentType] = useState(null);
    let [show, setShow] = useState(false);

    let data = {
        "created_by_id": null,
        "created_by_name": null,
        "document_type_id": 20,
        "updated_at": "2021-03-22 09:58:06",
        "created_at": "2021-03-22 09:58:06",
        "id": 1,
        "steps": [
            {
                "id": 1,
                "workflow_id": 1,
                "name": "Phònng nhân sự tạo hồ sơ cho nhân viên",
                "description": "Phònng nhân sự tạo hồ sơ cho nhân viên",
                "created_by_id": null,
                "created_by_name": null,
                "is_first": 1,
                "created_at": "2021-03-22 09:58:06",
                "updated_at": "2021-03-22 09:58:06",
                "actions": [
                    {
                        "id": 1,
                        "action_id": 1,
                        "action_name": "Thao tác tạo mới với quyền đã chọn",
                        "department_id": 115,
                        "department_name": "Phòng Tổ chức nhân sự",
                        "position_id": 73,
                        "position_name": "Nhân viên",
                        "pass": 6,
                        "reject": null
                    }
                ],
                "default_data_step_id": 1,
                "default_targets": [],
                "inputs": [],
                "step_id": 5,
                "pos_x": 189,
                "pos_y": 136,
                "html": "<div><div class=\"title-box\"><h6 class=\"mt-1\"><strong>Tên:</strong> Phònng nhân sự tạo hồ sơ cho nhân viên</h6><p class=\"mt-2\"><strong>Mô tả:</strong> Phònng nhân sự tạo hồ sơ cho nhân viên</p></div><div class=\"box\"><p class=\"box__target\">Phòng ban: Phòng Tổ chức nhân sự</p><p class=\"box__action\">Chức vụ: Nhân viên</p><p class=\"box__action\">Hành động: Thao tác tạo mới với quyền đã chọn</p></div></div>"
            },
            {
                "id": 2,
                "workflow_id": 1,
                "name": "Nhân viên cập nhật hồ sơ",
                "description": "Nhân viên cập nhật hồ sơ",
                "created_by_id": null,
                "created_by_name": null,
                "is_first": 0,
                "created_at": "2021-03-22 09:58:06",
                "updated_at": "2021-03-22 09:58:06",
                "actions": [
                    {
                        "id": 2,
                        "action_id": 2,
                        "action_name": "Thao tác chỉnh sửa với quyền đã chọn",
                        "department_id": null,
                        "department_name": null,
                        "position_id": null,
                        "position_name": null,
                        "pass": 7,
                        "reject": null
                    }
                ],
                "default_data_step_id": 2,
                "default_targets": [],
                "inputs": [
                    {
                        "name": "input_default",
                        "steps": [
                            {
                                "step_id": 5,
                                "output": "action-1_output_pass"
                            }
                        ]
                    }
                ],
                "step_id": 6,
                "pos_x": 663,
                "pos_y": 138,
                "html": "<div><div class=\"title-box\"><h6 class=\"mt-1\"><strong>Tên:</strong> Nhân viên cập nhật hồ sơ</h6><p class=\"mt-2\"><strong>Mô tả:</strong> Nhân viên cập nhật hồ sơ</p></div><div class=\"box\"><p class=\"box__target\">Phòng ban: Bất kỳ</p><p class=\"box__action\">Chức vụ: Bất kỳ</p><p class=\"box__action\">Hành động: Thao tác chỉnh sửa với quyền đã chọn</p></div></div>"
            },
            {
                "id": 3,
                "workflow_id": 1,
                "name": "Phòng nhân sự xác nhận",
                "description": "Phòng nhân sự xác nhận",
                "created_by_id": null,
                "created_by_name": null,
                "is_first": 0,
                "created_at": "2021-03-22 09:58:06",
                "updated_at": "2021-03-22 09:58:06",
                "actions": [
                    {
                        "id": 3,
                        "action_id": 5,
                        "action_name": "Thao tác xác nhận với quyền đã chọn",
                        "department_id": 115,
                        "department_name": "Phòng Tổ chức nhân sự",
                        "position_id": 73,
                        "position_name": "Nhân viên",
                        "pass": null,
                        "reject": null
                    }
                ],
                "default_data_step_id": 3,
                "default_targets": [],
                "inputs": [
                    {
                        "name": "input_default",
                        "steps": [
                            {
                                "step_id": 6,
                                "output": "action-2_output_pass"
                            }
                        ]
                    }
                ],
                "step_id": 7,
                "pos_x": 1263,
                "pos_y": 135,
                "html": "<div><div class=\"title-box\"><h6 class=\"mt-1\"><strong>Tên:</strong> Phòng nhân sự xác nhận</h6><p class=\"mt-2\"><strong>Mô tả:</strong> Phòng nhân sự xác nhận</p></div><div class=\"box\"><p class=\"box__target\">Phòng ban: Phòng Tổ chức nhân sự</p><p class=\"box__action\">Chức vụ: Nhân viên</p><p class=\"box__action\">Hành động: Thao tác xác nhận với quyền đã chọn</p></div></div>"
            }
        ],
        "workflow_pos_x": 4,
        "workflow_pos_y": 122
    };

    const onClickSelectDocumentType = item => {
        axios.get(urls.get_workflow_detail, {params: {type_id: item.id}}).then(
            ({status, data}) => {
                setShowModal(false);
                if (status === 200) {
                    setDocumentType(item)
                    editor.import(data);
                } else {
                    editor.clear()
                    alert.show('Không tìm thấy dữ liệu, Tiến hành tạo mới');
                    setDocumentType(item);
                }
            }
        )
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
            steps: steps.steps
        };
        data.document_type_id = documentType ? documentType.id : null;
        data.workflow_pos_x = editor.canvas_x;
        data.workflow_pos_y = editor.canvas_y;
        axios.post(urls.store_work_flow, data)
            .then(res => {
                alert.show('Lưu thành công');
            })
            .catch(err => {
                alert.show('Có lỗi xảy ra');
            });
    };

    let [step, setStep] = useState(data.steps.find(item => item.is_first));

    return (<div className={"flow"}>
            <aside className="flow__sidebar">
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="dark" onClick={() => setShowModal(true)}>
                        <AiOutlineSelect size={"25"}/> Chọn loại tài liệu
                    </Button>
                </div>
                {documentType && renderType(documentType)}
                {documentType && <Node urls={urls} drag={drag} tableId={tableId} editor={editor}/>}
                {/*<div className="d-flex justify-content-center mt-3">*/}
                {/*    <Button variant="dark" onClick={() => setShow(true)}>*/}
                {/*        <AiOutlineSelect size={"25"}/> Create issue*/}
                {/*    </Button>*/}
                {/*</div>*/}
                <FlowTool editor={editor} handleSave={handleSave}/>
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
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin tạo issue</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflow: 'hidden'}}>
                    <StepWizard>
                        {data.steps.map((_, index) => <Step step={step} setStep={setStep} key={index} data={data}/>)}
                    </StepWizard>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FlowChart;