import React, {useState, useEffect} from 'react'
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import Switch from "react-switch";

let coopApprovalOption = [
    {
        label: 'Duyệt đủ theo số lượng cho trước (đối tượng bất kỳ thuộc phòng ban - chức vụ ở trên)',
        value: 'sufficient_quantity_target_of_position_department'
    },
    {
        label: 'Chọn một số đối tượng cụ thể (thuộc phòng ban - chức vụ ở trên)',
        value: 'some_specific_target_of_position_department'
    }
];
const Position = props => {
    let {
        positions,
        editor,
        setParentData,
        reset,
        url
    } = props;

    let [disableSelect, setDisableSelect] = useState({
        action: true
    });

    let [selectedData, setSelectedData] = useState({
        position: null,
        action: null,
        same_department_on_step: null,
        required_to_select_specific_target: false,
        use_document_creator_department_for_position: true,
        co_approval: false,
        co_approval_type: coopApprovalOption[0],
        sufficient_quantity_target_of_position_department_value: 2,
        current_process_user_is_target: false
    });

    let [listActionByPos, setListActionByPos] = useState([]);

    const getActionData = pos => {
        axios.get(`${url.trim('/')}/${pos}`).then(({data}) => {
            let options = [];
            data = Object.values(data);
            if (data.length) {
                options = data.reduce((result, service) => {
                    let serviceName = service.name;
                    return [
                        ...result,
                        ...service.groups.reduce((final, group) => {
                            let fullName = `${serviceName} - ${group.name}`;
                            return [
                                ...final,
                                {
                                    label: fullName,
                                    options: group.permissions.map(per => ({value: per.id, label: per.name}))
                                }
                            ]
                        }, [])
                    ]
                }, [])
            }
            setListActionByPos(options);
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    };

    const formatGroupLabel = data => {
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#d2d2d2',
            padding: 10,
            color: 'white',
            margin: 0,
            fontSize: 15,
            fontWeight: 800
        }}>
            <span>{data.label}</span>
            <span style={{
                backgroundColor: '#EBECF0',
                borderRadius: '2em',
                color: '#172B4D',
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 'normal',
                lineHeight: '1',
                minWidth: 1,
                padding: '0.16666666666667em 0.5em',
                textAlign: 'center',
            }}>{data.options.length}</span>
        </div>;
    };

    const renderSelectCoopApprovalSelectType = () => {
        if (selectedData.co_approval) {
            return <Form.Group>
                <Form.Label>Loại đồng duyệt <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                <Select
                    menuPortalTarget={document.body}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                    placeholder="Loại dồng duyệt"
                    options={coopApprovalOption}
                    value={selectedData.co_approval_type}
                    onChange={option => {
                        setSelectedData({
                            ...selectedData,
                            co_approval_type: option
                        });
                    }}
                />
            </Form.Group>
        }
        return null;
    }

    const renderCoApprovalMetaData = () => {
        if (selectedData.co_approval && selectedData.co_approval_type) {
            switch (selectedData.co_approval_type.value) {
                case 'sufficient_quantity_target_of_position_department': {
                    return <Form.Group className="mt-3">
                        <Form.Label>Nhập số lượng đói tượng đồng duyệt
                            <span className="text-danger" title="Bắt buộc">*</span>
                        </Form.Label>
                        <Form.Control
                            name="name"
                            type="number"
                            value={selectedData.sufficient_quantity_target_of_position_department_value}
                            onChange={({target}) => setSelectedData({
                                ...selectedData,
                                sufficient_quantity_target_of_position_department_value: target.value
                            })}
                            min={2}/>
                    </Form.Group>
                }
            }
        }
        return null;
    }

    useEffect(() => {
        setDisableSelect({
            action: true
        });

        setSelectedData({
            position: null,
            action: null,
            same_department_on_step: null,
            use_document_creator_department_for_position: true,
            required_to_select_specific_target: false,
            co_approval: false,
            co_approval_type: coopApprovalOption[0],
            sufficient_quantity_target_of_position_department_value: 2,
            current_process_user_is_target: false
        })
    }, [reset])

    return (
        <div className="row mt-3">
            <div className="col-12">
                <Form.Group>
                    <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn chức vụ"
                        options={positions}
                        value={selectedData.position}
                        onChange={option => {
                            setSelectedData({
                                ...selectedData,
                                position: option,
                                action: null
                            });
                            setParentData('actions', []);
                            setDisableSelect({
                                action: false
                            });
                            getActionData(option.value);
                            setParentData('position', {id: option.value, name: option.label});
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Hành động <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        formatGroupLabel={formatGroupLabel}
                        placeholder="Chọn"
                        options={listActionByPos}
                        isDisabled={disableSelect.action}
                        value={selectedData.action}
                        onChange={option => {
                            setSelectedData({
                                ...selectedData,
                                action: option
                            });
                            setParentData('action', {id: option.value, name: option.label});
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                onChange={(checked) => {
                                    setSelectedData({
                                        ...selectedData,
                                        use_document_creator_department_for_position: checked
                                    });
                                    setParentData('use_document_creator_department_for_position', checked)
                                }}
                                checked={selectedData.use_document_creator_department_for_position}/>
                        <span className={"pl-2"}>Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={selectedData.co_approval || selectedData.current_process_user_is_target}
                                onChange={(checked) => {
                                    setSelectedData({
                                        ...selectedData,
                                        required_to_select_specific_target: checked,
                                        co_approval: false,
                                        co_approval_type: coopApprovalOption[0],
                                        sufficient_quantity_target_of_position_department_value: 2,
                                        current_process_user_is_target: false
                                    });
                                }}
                                checked={selectedData.required_to_select_specific_target}/>
                        <span className={"pl-2"}>Bắt buộc chọn đối tượng cụ thể</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={selectedData.co_approval || selectedData.required_to_select_specific_target}
                                onChange={(checked) => {
                                    setSelectedData({
                                        ...selectedData,
                                        current_process_user_is_target: checked,
                                        required_to_select_specific_target: false,
                                        co_approval: false,
                                        co_approval_type: coopApprovalOption[0],
                                        sufficient_quantity_target_of_position_department_value: 2,
                                    });
                                }}
                                checked={selectedData.current_process_user_is_target}/>
                        <span className={"pl-2"}>Chọn người đang tạo tài liệu làm đối tượng cho bước này</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={selectedData.required_to_select_specific_target || selectedData.current_process_user_is_target}
                                onChange={(checked) => {
                                    let tmp = {
                                        ...selectedData,
                                        co_approval: checked
                                    };
                                    if (!checked) {
                                        tmp.co_approval_type = coopApprovalOption[0];
                                        tmp.sufficient_quantity_target_of_position_department_value = 2;
                                    }
                                    setSelectedData(tmp)
                                }}
                                checked={selectedData.co_approval}/>
                        <span className={"pl-2"}>Đồng duyệt?</span>
                    </label>
                </Form.Group>
                {renderSelectCoopApprovalSelectType()}
                {renderCoApprovalMetaData()}
            </div>
        </div>
    )
}

export default Position;