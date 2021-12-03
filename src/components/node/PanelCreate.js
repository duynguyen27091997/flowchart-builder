import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import Switch from "react-switch";

const renderInfo = stepData => {
    let departmentName = stepData.department?.label ?? (stepData.use_document_creator_department_for_position ? 'Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ' : 'Không thuộc phòng ban nào')
    let positionName = stepData.position?.label;
    let actionName = stepData.action?.label
    return (
        <div>
            <h5>Đối tượng</h5>
            <p style={{marginBottom: 0}}><strong>- Phòng ban:</strong> {departmentName}</p>
            <p style={{marginBottom: 0}}><strong>- Chức vụ:</strong> {positionName}</p>
            <p style={{marginBottom: 0}}><strong>- Loại
                duyệt:</strong> {stepData.co_approval.enable ? 'Đồng duyệt' : 'Đơn duyệt'}</p>
            {stepData.co_approval.enable &&
            <p style={{marginBottom: 0}}><strong>- Loại đồng duyệt:</strong> {stepData.co_approval.type.label}</p>}
            {stepData.co_approval.enable && stepData.co_approval.type.value === 'sufficient_quantity_target_of_position_department' &&
            <p style={{marginBottom: 0}}><strong>- Số lương đối tượng đồng
                duyệt:</strong> {stepData.co_approval.type.approval_target_nums}</p>}
            {stepData.use_document_creator_as_step_target &&
            <p style={{marginBottom: 0}}>- Chọn người đang tạo tài liệu làm đối tượng cho bước này</p>}
            {stepData.required_to_select_specific_target &&
            <p style={{marginBottom: 0}}>- Bắt buộc chọn đối tượng cụ thể</p>}
            <br/>
            <h5>Hành động</h5>
            <p style={{marginBottom: 5}}>- {actionName}</p>
        </div>
    )
}

const renderOpinionInfo = data => {
    let department = data?.department?.label;
    if (data.use_document_creator_department_for_position){
        department = 'Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ'
    }
    return (
        <div>
            <h5>Phụ trách ý kiến</h5>
            <p style={{marginBottom: 0}}><strong>- Phòng ban:</strong> {department}</p>
            <p style={{marginBottom: 0}}><strong>- Chức vụ:</strong> {data?.position?.label}</p>
            <p style={{marginBottom: 0}}><strong>- Số lượng:</strong> {data.number_of_charge}</p>
        </div>
    )
}

const PanelCreate = props => {

    let {editor, setNodeData, setModalTargetAction, setModalOpinion, stepData} = props;

    const isHasFirstStep = () => editor.workflow.steps.find(item => item.is_first) !== undefined
    const [showTargetActionInfo, setShowTargetActionInfo] = useState(false);
    const [showOpinionInfo, setShowOpinionInfo] = useState(false);

    useEffect(() => {
        setShowTargetActionInfo(stepData.action !== null && stepData.action !== undefined)
        setShowOpinionInfo(
            stepData.charge_of_opinion.position !== null && stepData.charge_of_opinion.position !== undefined
        )
    }, [stepData])

    return (
        <div style={{padding: "10px", border: '1px solid black'}}>
            <h5 className="card-title">Thông tin step</h5>
            <Form.Group className="mt-3">
                <Form.Label>Tên <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Tên"
                    onChange={event => setNodeData({name: event.target.value})}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                    placeholder="Mô tả"
                    as="textarea"
                    rows={3}
                    onChange={event => setNodeData({description: event.target.value})}/>
            </Form.Group>
            {
                !isHasFirstStep() && <Form.Group className={"mt-3"}>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                onChange={checked => setNodeData({is_first: checked})}
                                checked={stepData.is_first}/>
                        <span className={"pl-2"}>Step đầu</span>
                    </label>
                </Form.Group>
            }
            <Button variant="outline-dark" onClick={() => setModalTargetAction(true)}>
                Thêm đối tượng và hành động
            </Button>
            <Button variant="outline-dark" className={"mt-3"} onClick={() => setModalOpinion(true)}>
                Thêm phụ trách ý kiến
            </Button>

            <div className={"mt-3"}>
                {showTargetActionInfo && renderInfo(stepData)}
            </div>

            <div className={"mt-3"}>
                {showOpinionInfo && renderOpinionInfo(stepData.charge_of_opinion)}
            </div>

        </div>
    )
}
export default PanelCreate;
