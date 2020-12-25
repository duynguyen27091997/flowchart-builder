import React, {useState, useEffect} from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import SweetAlert from 'sweetalert2-react';
import Node from "./Node";
import FlowTool from "./FlowTool";

import Modal from 'react-modal';
import Select from "react-select";

Modal.setAppElement('#root')

const customStyles = {
    content: {
        width: '500px',
        height: '500px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const FlowChart = ({workflowId = null}) => {

    let [editor, drag, drop, allowDrop] = useFlowChart(workflowId)

    let [workflow, setWorkflow] = useState({});
    let [loading, setLoading] = useState(false);
    let [swal, setSwal] = useState(false);
    let [swalTitle, setSwalTitle] = useState('');
    let [swalText, setSwalText] = useState('');

    let [targets, setTargets] = useState([]);
    let [actions, setActions] = useState([]);
    let [workflowTypes, setWorkflowTypes] = useState([]);

    const getData = async () => {
        const targets = await fetch('https://workflow.tuoitre.vn/api/step/get-action-target-types');
        const actions = await fetch('https://workflow.tuoitre.vn/api/step/get-action-types');
        const workflowTypes = await fetch('https://workflow.tuoitre.vn/api/workflow/get-workflow-types');
        return Promise.all([targets.json(), actions.json(), workflowTypes.json()])
    }

    useEffect(() => {
        getData().then(res => {
            let targets = Object.keys(res[0]).reduce((init, current) => {
                return [...init, {value: current, label: res[0][current]}]
            }, []);

            let actions = Object.keys(res[1]).reduce((init, current) => {
                return [...init, {value: current, label: res[1][current]}]
            }, []);

            let workflowTypes = Object.keys(res[2]).reduce((init, current) => {
                return [...init, {value: current, label: res[2][current]}]
            }, []);


    if(editor) {
        editor.import({"steps":[{"step_id":2,"workflow_id":1,"description":"Phòng nhân sự tạo hồ sơ cho nhân viên","name":"Tạo hồ sơ","html":"<div><div class=\"title-box\"><h6>Tạo hồ sơ</h6><p>Phòng nhân sự tạo hồ sơ cho nhân viên</p></div><div class=\"box\"><p class=\"box__target\">Đối tượng chung: Phòng ban</p><p class=\"box__action\">Tác vụ : Tạo</p><p class=\"box__action\">Đối tượng cụ thể : <br><strong> Leanne Graham</strong></p></div></div>","is_first":true,"inputs":[],"actions":[{"name":"create","target_type":"department","pass":"3","reject":null}],"targets":[{"id":1,"name":"Leanne Graham","type":"department","action":"create"}],"pos_x":123,"pos_y":79},{"step_id":3,"workflow_id":1,"description":"Nhân viên xem & sửa thông tin","name":"Nhân viên cập nhật hồ sơ","html":"<div><div class=\"title-box\"><h6>Nhân viên cập nhật hồ sơ</h6><p>Nhân viên xem & sửa thông tin</p></div><div class=\"box\"><p class=\"box__target\">Đối tượng chung: Cá nhân</p><p class=\"box__action\">Tác vụ : Cập nhật</p><p class=\"box__action\">Đối tượng cụ thể : <br><strong> Leanne Graham</strong></p></div></div>","is_first":false,"inputs":[{"name":"input_default","steps":[{"step_id":"2","output":"create_output_pass"}]}],"actions":[{"name":"update","target_type":"personal","pass":"4","reject":null}],"targets":[{"id":1,"name":"Leanne Graham","type":"personal","action":"update"}],"pos_x":582,"pos_y":109},{"step_id":4,"workflow_id":1,"description":"Phòng nhân sự xem xét, lưu thông tin đã chỉnh sửa từ nhân viên","name":"Phòng Nhân sự lưu hồ sơ","html":"<div><div class=\"title-box\"><h6>Phòng Nhân sự lưu hồ sơ</h6><p>Phòng nhân sự xem xét, lưu thông tin đã chỉnh sửa từ nhân viên</p></div><div class=\"box\"><p class=\"box__target\">Đối tượng chung: Phòng ban</p><p class=\"box__action\">Tác vụ : Xác nhận</p><p class=\"box__action\">Đối tượng cụ thể : <br><strong> Leanne Graham</strong></p></div></div>","is_first":false,"inputs":[{"name":"input_default","steps":[{"step_id":"3","output":"update_output_pass"}]}],"actions":[{"name":"confirm","target_type":"department","pass":null,"reject":null}],"targets":[{"id":1,"name":"Leanne Graham","type":"department"}],"pos_x":965,"pos_y":96}]});
    }

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleSelectChangeWorkflow = (val, action) => {
        setLoading(true);
        closeModal();
        setTimeout(() => {
            axios.get(`https://workflow.tuoitre.vn/api/workflow/detail?type=${val.value}`).then(res => {
                if (res.status === 200) {
                    editor.clear()
                    editor.import(res.data);
                } else {
                    setSwalTitle('No Data')
                    setSwalText('Oops, no data to show')
                    setSwal(true);
                }
                setLoading(false);

            }, err => {
                setSwalTitle('Error')
                setSwalText('Oops, have an error')
            })
        }, 2000)
    };

    return (
        <LoadingOverlay active={loading} spinner text='Creating...'>
            <SweetAlert
                show={swal}
                title={swalTitle}
                text={swalText}
                onConfirm={() => setSwal(false)}
            />
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal">
                <div className={"node__form-group"}>
                    <label>Select workflow type</label>
                    <Select
                        onChange={handleSelectChangeWorkflow}
                        options={workflowTypes}/>
                </div>
            </Modal>
            <div className={"flow"}>
                <aside className="flow__sidebar">
                    <Node drag={drag} setWorkflow={setWorkflow} dataTargets={targets} dataActions={actions}
                          dataWorkflowTypes={workflowTypes}/>
                    <FlowTool editor={editor} handleSave={handleSave} openModal={openModal}/>
                </aside>
                <main id={'draw-main'} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
            </div>
        </LoadingOverlay>
    );
};

export default FlowChart;