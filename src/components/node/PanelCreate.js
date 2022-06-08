import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";

const renderInfo = stepData => {
    return (
        <div>
            <h5 className="card-title">Đối tượng</h5>
            {Object.keys(stepData.targets).map(key => (
                <div className="alert alert-dark alert-dismissible fade show" role="alert" key={key}>
                    {stepData.targets[key].department ? <span><strong>{stepData.targets[key].department?.label}</strong> - </span> : ''}
                    <strong>{stepData.targets[key].position.label}</strong>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ))}
        </div>
    )
}

const PanelCreate = props => {
    let {setNodeData, setShowModalTarget, stepData} = props;
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

            <div className={"mt-3"}>
                { renderInfo(stepData) }
            </div>
        </div>
    )
}
export default PanelCreate;
