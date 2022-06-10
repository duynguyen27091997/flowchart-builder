import React, {useContext} from 'react';
import {Button, Form} from "react-bootstrap";
import FlowContext from "../../flow-context";

const PanelCreate = props => {
    let {setNodeData, setShowModalTarget, setShowModalAssign, stepData} = props;
    let {editor} = useContext(FlowContext);

    return (
        <div style={{padding: "10px", border: '1px solid black'}}>
            <Form.Group className="mt-3">
                <Form.Label>Tên step<span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Tên"
                    value={stepData.name ?? ''}
                    onChange={event => setNodeData({name: event.target.value})}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Mô tả step</Form.Label>
                <Form.Control
                    placeholder="Mô tả"
                    as="textarea"
                    rows={3}
                    value={stepData.description ?? ''}
                    onChange={event => setNodeData({description: event.target.value})}/>
            </Form.Group>
            <Button variant="outline-dark" onClick={() => setShowModalTarget(true)}>
                Thêm đối tượng
            </Button>
            <Button
                className={'ml-1'}
                variant="outline-dark"
                onClick={() => setShowModalAssign(true)}
                disabled={(editor.workflow.steps.length < 1) || (!Object.keys(stepData.targets).length)}>
                Thêm phân công
            </Button>

            <div className={"mt-3"}>
                <div>
                    <h5 className="card-title">Đối tượng</h5>
                    {Object.keys(stepData.targets).map(key => (
                        <div className="alert alert-dark alert-dismissible fade show" role="alert" key={key}>
                            {stepData.targets[key].department ? <span><strong>{stepData.targets[key].department?.label}</strong> - </span> : ''}
                            <strong>{stepData.targets[key].position.label}</strong>
                        </div>
                    ))}
                </div>
            </div>

            <div className={"mt-3"}>
                <div>
                    <h5 className="card-title">Đối tượng phân công</h5>
                    {Object.keys(stepData.assign_targets).map(key => (
                        <div className="alert alert-dark alert-dismissible fade show" role="alert" key={key}>
                            {stepData.assign_targets[key].department ? <span><strong>{stepData.assign_targets[key].department?.label}</strong> - </span> : ''}
                            <strong>{stepData.assign_targets[key].position.label}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default PanelCreate;
