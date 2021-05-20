import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import {useAlert} from 'react-alert'
import Switch from "react-switch";

import {COOP_APPROVAL_TYPE} from '../../../helpers/constants';

const COOP_APPROVAL_TYPE_DEFAULT = Object.values(COOP_APPROVAL_TYPE.department_position).find(value => {
    return value.default;
})


const DepartmentPosition = props => {
    let {departments, positions, url, setParentData, reset, editor} = props;
    let alert = useAlert();
    let [disabled, setDisabled] = useState({department: false, position: true, action: true});
    let steps = editor.workflow.steps.filter(item => item.actions[0].department && item.actions[0].position).map(step => ({label: step.name, value: step.step_id}));
    let [data, setData] = useState({
        department: null,
        position: null,
        action: null,
        co_approval: false,
        co_approval_type: null,
        required_to_select_specific_target: true,
        use_targets_from_exists_step: false
    });

    let [listActions, setListActions] = useState([]);

    const getActionData = (depart, pos) => {
        axios.get(url, {params: {dep_id: depart, pos_id: pos}})
            .then(({data}) => {
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
            })
            .catch(err => {
                alert.show('Có lỗi xảy ra');
            });
    }

    const formatGroupLabel = data => {
        return (
            <div style={{
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
            </div>
        )
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
        setDisabled({position: true, action: true});

        setData({
            department: null,
            position: null,
            action: null,
            co_approval: false,
            co_approval_type: null,
            required_to_select_specific_target: true,
            use_targets_from_exists_step: false
        });

        setListActions([]);

        setParentData('co_approval.enable', false);
        setParentData('co_approval.type', null);
        setParentData('co_approval.approval_target_nums', null)

    }, [reset])

    return (
        <div className="row">
            <div className="col-12">
                <Form.Group>
                    <Form.Label>Phòng ban <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        isDisabled={disabled.department}
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn phòng ban"
                        options={departments}
                        value={data.department}
                        onChange={option => {
                            setDisabled({...disabled, position: false, action: true});
                            setData({...data, department: option})
                            setParentData('department', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn chức vụ"
                        options={positions}
                        isDisabled={disabled.position}
                        value={data.position}
                        onChange={option => {
                            setDisabled({...disabled, action: false})
                            getActionData(data.department.value, option.value);
                            setData({...data, position: option})
                            setParentData('position', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Hành động <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        formatGroupLabel={formatGroupLabel}
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Hành động"
                        value={data.action}
                        options={listActions}
                        isDisabled={disabled.action}
                        onChange={option => {
                            setData({...data, action: option})
                            setParentData('action', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={data.co_approval || data.use_targets_from_exists_step}
                                onChange={checked => {
                                    setData({...data, required_to_select_specific_target: checked});
                                    setParentData('required_to_select_specific_target', checked)
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
                                onChange={checked => {
                                    let tmp = {...data, use_targets_from_exists_step: checked};
                                    if (checked) {
                                        tmp = {
                                            ...tmp,
                                            department: null,
                                            position: null,
                                            co_approval: false,
                                            co_approval_type: null
                                        };
                                        setDisabled({department: true, position: true, action: false})
                                    } else {
                                        setDisabled({department: false, position: true, action: true})
                                    }
                                    setData(tmp)
                                }}
                                checked={data.use_targets_from_exists_step}/>
                        <span className={"pl-2"}>Lấy đối tượng ở những bước đã duyệt trước đó</span>
                    </label>
                </Form.Group>
                {
                    data.use_targets_from_exists_step &&
                    <Form.Group>
                        <Form.Label>Chọn step <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                        <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            placeholder="Chọn step"
                            options={steps}
                            // value={data.co_approval_type}
                            onChange={option => {
                                // setData({...data, co_approval_type: option});
                            }}
                        />
                    </Form.Group>
                }
                <Form.Group>
                    <label className={"d-flex align-items-center"}>
                        <Switch height={20}
                                width={45}
                                disabled={data.required_to_select_specific_target || data.use_targets_from_exists_step}
                                onChange={checked => {
                                    let co_approval = false;
                                    let co_approval_type = null
                                    if (checked) {
                                        co_approval = checked;
                                        co_approval_type = COOP_APPROVAL_TYPE_DEFAULT
                                    }
                                    setData({
                                        ...data,
                                        required_to_select_specific_target: false,
                                        co_approval,
                                        co_approval_type
                                    })
                                    setParentData('co_approval.enable', co_approval);
                                    setParentData('co_approval.type', co_approval_type);

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
                            options={Object.values(COOP_APPROVAL_TYPE.department_position)}
                            value={data.co_approval_type}
                            onChange={option => {
                                setData({...data, co_approval_type: option});
                            }}
                        />
                    </Form.Group>
                }
                {renderCoApprovalMetaData()}
            </div>
        </div>
    )
}

export default DepartmentPosition;