import React, {useState, useEffect} from 'react'
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import Switch from "react-switch";
import {COOP_APPROVAL_TYPE} from '../../../helpers/constants'

const COOP_APPROVAL_TYPE_DEFAULT = Object.values(COOP_APPROVAL_TYPE.position).find(value => {
    return value.default;
})

const Position = props => {
    let {
        positions,
        editor,
        setParentData,
        reset,
        url
    } = props;

    let [data, setData] = useState({
        position: null,
        action: null,
        required_to_select_specific_target: true,
        use_document_creator_department_for_position: false,
        co_approval: false,
        co_approval_type: null,
        current_process_user_is_target: false
    });

    let [listActions, setListActions] = useState([]);

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
            setListActions(options);
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

    const renderCoApprovalMetaData = () => {
        if (data.co_approval) {
            switch (data.co_approval_type.value) {
                case 'sufficient_quantity_target_of_position_department': {
                    return <Form.Group className="mt-3">
                        <Form.Label>Nhập số lượng đói tượng đồng duyệt
                            <span className="text-danger" title="Bắt buộc">*</span>
                        </Form.Label>
                        <Form.Control
                            name="name"
                            type="number"
                            value={data.co_approval_type.approval_target_nums}
                            onChange={({target}) => {
                                setData({
                                    ...data,
                                    co_approval_type: {
                                        ...data.co_approval_type,
                                        approval_target_nums: target.value
                                    }
                                })
                                setParentData('co_approval.approval_target_nums', target.value)
                            }}
                            min={2}/>
                    </Form.Group>
                }
            }
        }
        return null;
    }

    useEffect(() => {
        setData({
            position: null,
            action: null,
            required_to_select_specific_target: true,
            use_document_creator_department_for_position: false,
            co_approval: {
                enable: false,
                type: null
            },
            current_process_user_is_target: false
        })

        // setParentData('co_approval.type', coopApprovalOption[0].value);
        // setParentData('co_approval.approval_target_nums', 2)

    }, [reset])

    useEffect(() => {
        setParentData(data);
    }, [data])

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
                        value={data.position}
                        onChange={option => {
                            setData({...data, position: option, action: null});
                            getActionData(option.value);
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
                        options={listActions}
                        isDisabled={data.action}
                        value={data.action}
                        onChange={option => {
                            setData({...data, action: option});
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                onChange={(checked) => {
                                    setData({...data, use_document_creator_department_for_position: checked});
                                }}
                                checked={data.use_document_creator_department_for_position}/>
                        <span className={"pl-2"}>Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={data.co_approval || data.current_process_user_is_target}
                                onChange={(checked) => {
                                    setData({...data, required_to_select_specific_target: checked});
                                }}
                                checked={data.required_to_select_specific_target}/>
                        <span className={"pl-2"}>Bắt buộc chọn đối tượng cụ thể</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={data.co_approval || data.required_to_select_specific_target}
                                onChange={(checked) => {
                                    setData({...data, current_process_user_is_target: checked});
                                }}
                                checked={data.current_process_user_is_target}/>
                        <span className={"pl-2"}>Chọn người đang tạo tài liệu làm đối tượng cho bước này</span>
                    </label>
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={data.required_to_select_specific_target || data.current_process_user_is_target}
                                onChange={(checked) => {
                                    let co_approval = false;
                                    let co_approval_type = null
                                    if (checked) {
                                        co_approval = checked;
                                        co_approval_type = COOP_APPROVAL_TYPE_DEFAULT
                                    }
                                    setData({
                                        ...data,
                                        required_to_select_specific_target: false,
                                        co_approval: {
                                            enable: co_approval,
                                            type: co_approval_type
                                        }
                                    })
                                }}
                                checked={data.co_approval}/>
                        <span className={"pl-2"}>Đồng duyệt</span>
                    </label>
                </Form.Group>
                {
                    data.co_approval &&
                    <Form.Group>
                        <Form.Label>Loại đồng duyệt <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                        <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            placeholder="Loại dồng duyệt"
                            options={Object.values(COOP_APPROVAL_TYPE.position)}
                            value={data.co_approval_type}
                            onChange={option => {
                                setData({...data, co_approval: {...data.co_approval, type: option}});
                            }}
                        />
                    </Form.Group>
                }
                {/*{renderCoApprovalMetaData()}*/}
            </div>
        </div>
    )
}

export default Position;