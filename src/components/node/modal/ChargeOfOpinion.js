import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import Select from "react-select";
import Switch from "react-switch";

const ChargeOfOpinion = props => {

    const {departments, positions, setParentData} = props;

    const [data, setData] = useState({
        position: null,
        department: null,
        number_of_charge: 1,
        use_document_creator_department_for_position: false
    })

    useEffect(() => {
        setParentData({
            charge_of_opinion: {
                ...data,
                enable: data.position !== null && data.position !== undefined
            }
        })
    }, [data]);

    return (
        <div className="row">
            <div className="col-12">
                <div className="border mt-3" style={{padding: 10, backgroundColor: 'rgb(128 128 128 / 6%)'}}>
                    <h5 style={{fontWeight: 700}}>Đối tượng</h5>
                    <Form.Group className="mt-3">
                        <Form.Label>Phòng ban <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                        <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            placeholder="Chọn phòng ban"
                            options={departments}
                            isDisabled={data.use_document_creator_department_for_position}
                            value={data.department}
                            onChange={option => {
                                setData({
                                    ...data,
                                    department: option
                                })
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <label className={"d-flex align-items-center"}>
                            <Switch height={20}
                                    width={45}
                                    onChange={(checked) => {
                                        let department = data.department
                                        if (checked) {
                                            department = null
                                        }
                                        setData({
                                            ...data,
                                            department,
                                            use_document_creator_department_for_position: checked,
                                        })
                                    }}
                                    checked={data.use_document_creator_department_for_position}/>
                            <span
                                className={"pl-2"}>Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ</span>
                        </label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                        <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            placeholder="Chọn chức vụ"
                            options={positions}
                            value={data.position}
                            onChange={option => {
                                setData({
                                    ...data,
                                    position: option
                                })
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nhập số lượng phụ trách
                            <span className="text-danger" title="Bắt buộc">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={data.number_of_charge}
                            onChange={event => {
                                setData({
                                    ...data,
                                    number_of_charge: parseInt(event.target.value)
                                })
                            }}
                            min={1}/>
                    </Form.Group>
                </div>
            </div>
        </div>
    )
}
export default ChargeOfOpinion;
