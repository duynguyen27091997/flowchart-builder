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

    let steps = editor.workflow.steps.map(step => ({
        label: step.name,
        value: step.step_id
    }));

    let [data, setData] = useState({
        department: null,
        position: null,
        action: null,
        co_approval: {
            enable: false,
            type: null
        },
        required_to_select_specific_target: true
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
        if (data.co_approval.enable) {
            switch (data.co_approval.type.value) {
                case 'sufficient_quantity_target_of_position_department': {
                    return <Form.Group className="mt-3">
                        <Form.Label>Nhập số lượng đối tượng đồng duyệt
                            <span className="text-danger" title="Bắt buộc">*</span>
                        </Form.Label>
                        <Form.Control
                            name="approval_target_nums"
                            type="number"
                            value={data.co_approval.type.approval_target_nums}
                            onChange={({target}) => {
                                setData({
                                    ...data,
                                    co_approval: {
                                        ...data.co_approval,
                                        type: {
                                            ...data.co_approval.type,
                                            approval_target_nums: target.value
                                        }
                                    }
                                })
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
            co_approval: {
                enable: false,
                type: null
            },
            required_to_select_specific_target: true
        });
        setListActions([]);
    }, [reset]);

    useEffect(() => {
        setParentData({
            ...data,
            use_document_creator_as_step_target: false,
            use_document_creator_department_for_position: false
        })
    }, [data])

    return (
        <div className="row">
            <div className="col-12">
                <div className="border mt-3" style={{padding: 10, backgroundColor: 'rgb(128 128 128 / 6%)'}}>
                    <h5 style={{fontWeight: 700}}>Đối tượng</h5>
                    <Form.Group className="mt-3">
                        <Form.Label>Phòng ban <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                        <Select
                            isDisabled={disabled.department}
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            placeholder="Chọn phòng ban"
                            options={departments}
                            value={data.department}
                            onChange={option => {
                                /* reset position & action to default */
                                setDisabled({...disabled, position: false, action: true});
                                setData({...data, department: option, position: null, action: null})
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
                                /* reset action to default */
                                setDisabled({...disabled, action: false})
                                getActionData(data.department.value, option.value);
                                setData({...data, position: option, action: null})
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <label className={"d-flex align-items-center"}>
                            <Switch height={20}
                                    width={45}
                                    disabled={data.co_approval.enable || data.use_targets_from_exists_step}
                                    onChange={checked => {
                                        setData({...data, required_to_select_specific_target: checked});
                                    }}
                                    checked={data.required_to_select_specific_target}/>
                            <span className={"pl-2"}>Bắt buộc chọn đối tượng cụ thể <strong>(đơn duyệt)</strong></span>
                        </label>
                    </Form.Group>
                    <Form.Group>
                        <label className={"d-flex align-items-center"}>
                            <Switch height={20}
                                    width={45}
                                    disabled={data.required_to_select_specific_target || data.use_targets_from_exists_step}
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
                                    checked={data.co_approval.enable}/>
                            <span className={"pl-2"}><strong>Đồng duyệt</strong> nhiều đối tượng</span>
                        </label>
                    </Form.Group>
                    {
                        data.co_approval.enable &&
                        <Form.Group>
                            <Form.Label>Loại đồng duyệt <span className="text-danger"
                                                              title="Bắt buộc">*</span></Form.Label>
                            <Select
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                placeholder="Loại dồng duyệt"
                                options={Object.values(COOP_APPROVAL_TYPE.department_position)}
                                value={data.co_approval.type}
                                onChange={option => {
                                    setData({...data, co_approval: {...data.co_approval, type: option}});
                                }}
                            />
                        </Form.Group>
                    }
                    {renderCoApprovalMetaData()}
                </div>
                <div className="border mt-3" style={{padding: 10, backgroundColor: 'rgb(128 128 128 / 6%)'}}>
                    <h5 style={{fontWeight: 700}}>Hành động</h5>
                    <Form.Group>
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
                            }}
                        />
                    </Form.Group>
                </div>
            </div>
        </div>
    )
}

export default DepartmentPosition;