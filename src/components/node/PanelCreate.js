import React, {useState} from 'react';
import {Button, Form} from "react-bootstrap";
import Switch from "react-switch";

const PanelCreate = ({editor, change, setShowModal, display, stepData}) => {
    const isHasFirstStep = () => editor.workflow.steps.find(item => item.is_first) !== undefined
    const [check, setCheck] = useState(false);

    const renderInfo = () => {
        let departmentName = stepData.department?.label ?? (stepData.use_document_creator_department_for_position ? 'Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ' : 'Không thuộc phòng ban nào')
        let positionName =stepData.position?.label;
        let actionName = stepData.action?.label
        return (
            <div>
                <h5>Đối tượng</h5>
                <p style={{marginBottom: 0}}><strong>- Phòng ban:</strong> {departmentName}</p>
                <p style={{marginBottom: 0}}><strong>- Chức vụ:</strong> {positionName}</p>
                <p style={{marginBottom: 0}}><strong>- Loại duyệt:</strong> {stepData.co_approval.enable ? 'Đồng duyệt' : 'Đơn duyệt'}</p>
                {stepData.co_approval.enable && <p style={{marginBottom: 0}}><strong>- Loại đồng duyệt:</strong> {stepData.co_approval.type.label}</p>}
                {stepData.co_approval.enable && stepData.co_approval.type.value === 'sufficient_quantity_target_of_position_department' &&
                <p style={{marginBottom: 0}}><strong>- Số lương đối tượng đồng duyệt:</strong> {stepData.co_approval.type.approval_target_nums}</p>}
                {stepData.use_document_creator_as_step_target && <p style={{marginBottom: 0}}>- Chọn người đang tạo tài liệu làm đối tượng cho bước này</p>}
                {stepData.required_to_select_specific_target && <p style={{marginBottom: 0}}>- Bắt buộc chọn đối tượng cụ thể</p>}
                <br/>
                <h5>Hành động</h5>
                <p style={{marginBottom: 5}}>- {actionName}</p>
            </div>
        )
    }

    return (
        <div style={{padding: "10px", border: '1px solid black'}}>
            <h5 className="card-title">Thông tin step</h5>
            <Form.Group className="mt-3">
                <Form.Label>Tên <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                <Form.Control
                    name="name"
                    type="text"
                    placeholder="Tên"
                    onChange={({target}) => change(target.name, target.value)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                    name="description"
                    placeholder="Mô tả"
                    as="textarea"
                    rows={3}
                    onChange={({target}) => change(target.name, target.value)}/>
            </Form.Group>
            {
                !isHasFirstStep() && <Form.Group className={"mt-3"}>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                onChange={(checked) => {
                                    change('is_first', checked);
                                    setCheck(checked);
                                }}
                                checked={check}/>
                        <span className={"pl-2"}>Step đầu</span>
                    </label>
                </Form.Group>
            }
            <Button variant="outline-dark" onClick={() => setShowModal(true)}>
                Thêm đối tượng và hành động
            </Button>
            <div className={"mt-5"}>
                {display && renderInfo()}
            </div>

        </div>
    )
}
export default PanelCreate;