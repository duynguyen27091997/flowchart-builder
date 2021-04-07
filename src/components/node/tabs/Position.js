import React, {useState, useEffect} from 'react'
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

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
        same_department_on_step: null
    });

    let [listActionByPos, setListActionByPos] = useState([]);

    useEffect(() => {
        setDisableSelect({
            action: true
        });

        setSelectedData({
            position: null,
            action: null,
            same_department_on_step: null
        })
    }, [reset])

    let as = [
        {
            label: 'asdasdsadas',
            options: [
                {
                    label: 'czx',
                    value: 'asdasda'
                }
            ]
        }
    ];
    const getActionData = pos => {
        axios.get(`${url.trim('/')}/${pos}`).then(({data}) => {
            let options = [];
            data = Object.values(data);
            if (data.length) {
                options = data.map(item => {
                    let serviceName = item.name;
                    let metaOption = {};
                    item.groups.map(group => {
                        let groupName = group.name;
                        metaOption.label = serviceName + ' - ' + groupName
                        metaOption.options = group.permissions.map(permission => ({
                            label: permission.name,
                            value: permission.id
                        }));
                    });
                    return metaOption;
                });
            }
            setListActionByPos(options);
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    };


    const convertData = () => {

    }

    const formatGroupLabel = data => (
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
    );


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
                    <Form.Label>Cùng phòng ban với đói tượng ở bước:</Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        options={editor.workflow.steps.map(step => ({value: step.step_id, label: step.name}))}
                        onChange={option => {
                            setSelectedData({
                                ...selectedData,
                                same_department_on_step: option
                            });
                            setParentData('same_department_on_step', {id: option.value, name: option.label});
                        }}
                    />
                </Form.Group>
            </div>
        </div>
    )
}

export default Position;