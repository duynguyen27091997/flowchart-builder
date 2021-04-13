import React from 'react';
import {Button, Form} from "react-bootstrap";

const PanelCreate = ({editor, change, setShowModal, display}) => {

    const isHasFirstStep = () => editor.workflow.steps.find(item => item.is_first) !== undefined

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
            <Button variant="outline-dark" onClick={() => setShowModal(true)}>
                Thêm đối tượng và hành động
            </Button>
            {display}
            {
                !isHasFirstStep() && <Form.Group>
                    <Form.Check
                        className="mt-3"
                        name="is_first"
                        type="checkbox"
                        label="Step đầu"
                        onChange={({target}) => change(target.name, target.checked)}/>
                </Form.Group>
            }
        </div>
    )
}
export default PanelCreate;