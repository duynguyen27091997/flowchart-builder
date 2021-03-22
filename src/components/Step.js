import React from 'react';
import {Button} from "react-bootstrap";
import Select from "react-select";

const Step = ({step, data, nextStep, previousStep, setStep}) => {
    let prevStep = data.steps.find(item => item.actions[0].pass === step.step_id || item.actions[0].reject === step.step_id);
    let nextPassStep = data.steps.find(item => step.actions[0].pass === item.step_id);
    let nextRejectStep = data.steps.find(item => item.actions[0].reject === item.step_id);

    let options = [
        {value: 1, label: 'Nguyễn Hưu Huân'},
        {value: 2, label: 'Lỗ Văn Bấc'},
        {value: 3, label: 'Chu Hoàng Đào'},
        {value: 4, label: 'Nguyễn Quốc Sơn'},
        {value: 5, label: 'Phùng Ngọc Bảo'},
        {value: 6, label: 'Lý Minh Nghị'},
        {value: 7, label: 'Pà Thị Nong'},
    ];
    return <div>
        <h4 className="font-weight-bold text-center">{step.name}</h4>
        <p className="text-center">{step.description}</p>
        <div className="mt-5 mb-5">
            <h5><strong>Hành động:</strong> {step.actions[0].action_name}</h5>
            <h5><strong>Phòng ban:</strong> {step.actions[0].department_name ? step.actions[0].department_name :
                <i className="text-muted">Bất kỳ</i>}</h5>
            <h5><strong>Vị trí:</strong> {step.actions[0].position_name ? step.actions[0].position_name :
                <i className="text-muted">Bất kỳ</i>}</h5>
        </div>
        <Select
            name="department"
            placeholder="Chọn đối tượng cụ thể"
            options={options}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        <div className="row mt-5">
            <div className="col-6 text-left">
                {
                    prevStep && <Button variant="outline-info" onClick={() => {
                        setStep(prevStep);
                        previousStep()
                    }}><strong>Quay lại</strong>
                        <p style={{marginBottom: 0}}>{prevStep.name}</p></Button>
                }
            </div>
            <div className="col-6 text-right">
                {
                    nextPassStep && <Button variant="outline-success" onClick={() => {
                        setStep(nextPassStep);
                        nextStep()
                    }}><strong>Tiếp (confirm)</strong>
                        <p style={{marginBottom: 0}}>{nextPassStep.name}</p>
                    </Button>
                }
                {
                    nextRejectStep && <Button variant="outline-success" onClick={() => {
                        setStep(nextRejectStep);
                        nextStep()
                    }}><strong>Tiếp (reject)</strong>
                        <p style={{marginBottom: 0}}>{nextRejectStep.name}</p></Button>
                }
            </div>
        </div>
    </div>
}

export default Step;