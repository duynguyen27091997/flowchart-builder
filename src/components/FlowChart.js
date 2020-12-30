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

            setTargets(targets);
            setActions(actions);
            setWorkflowTypes(workflowTypes);
        })
    }, []);

    const handleSave = steps => {
        setLoading(true);
        let data = {
            workflow_name: workflow.workflow_name,
            workflow_type: workflow.workflow_type,
            workflow_description: workflow.workflow_description,
            steps: steps.steps
        }
        setTimeout(() => {
            axios.post('https://workflow.tuoitre.vn/api/step/store-steps', data).then(
                res => {
                    setSwalTitle('Success')
                    setSwalText('Create workflow successful')
                    setLoading(false);
                    setSwal(true);
                    editor.clear()
                },
                err => {
                    setSwalTitle('Error')
                    setSwalText('Oops, have an error')
                    setLoading(false);
                    setSwal(true);
                }
            )
        }, 2000)
    }

    if (editor) {
        editor.start();
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