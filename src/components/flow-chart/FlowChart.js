import React, {useEffect, useState} from "react";
import useFlowChart from "../../hooks/useFlowChart";
import "./FlowChart.scss";

import axios from "axios";
import Node from "../node/Node";
import FlowTool from "../flow-tool/FlowTool";
import {AiOutlineSelect} from "react-icons/ai";
import FlowList from "../flow-list/FlowList";
import {useAlert} from 'react-alert'
import {Button, Modal} from "react-bootstrap";

const FlowChart = props => {
    let {
        urls,
        tableId
    } = props;

    function countArray(arr = []){
        if(arr.length > 0){

            //get unique element in array
            let tmp = [...new Set([...arr])].map(item=>({[item]: 0}));

            // loop & count element is appear again
            let result = arr.reduce((current,next)=>{
                if(current.length > 0){
                    current.map(item=>{
                        if(Object.keys(item).join('') == next)
                            item[Object.keys(item)] = parseInt(item[Object.keys(item)])+1;
                    })
                }
                return current;
            },tmp);
            return result;
        }
        return arr;
    }

    let data = ['a', 'b', 'c', 'a123', 'd', 'd', 'b', 'bbb'];

    console.log(countArray(data))

    let alert = useAlert();
    let [editor, drag, drop, allowDrop] = useFlowChart();
    let [showModal, setShowModal] = useState(false);
    let [listDocumentTypes, setListDocumentTypes] = useState([]);
    let [documentType, setDocumentType] = useState(null);

    const onClickSelectDocumentType = item => {
        axios.get(urls.get_workflow_detail, {params: {type_id: item.id}}).then(
            ({status, data}) => {
                setShowModal(false);
                if (status === 200) {
                    setDocumentType(item)
                    editor.import(data);
                } else {
                    editor.clear()
                    alert.show('Không tìm thấy dữ liệu, Tiến hành tạo mới');
                    setDocumentType(item);
                }
            }
        )
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }
    const renderType = type => {
        return <div className={'mt-5 mb-5 text-center'}>
            <p>Loại tài liệu</p>
            <p className={'font-weight-bold'}>{type.display_name} </p>
        </div>
    }
    const getData = async () => {
        return axios.get(urls.get_list_document_types);
    }

    useEffect(() => {
        getData().then(({status, data}) => {
            if (status === 200) setListDocumentTypes(data);
        });
    }, []);

    useEffect(() => {
        editor && editor.start();
    }, [editor]);

    const handleSave = steps => {
        let data = {
            steps: steps.steps
        };
        data.document_type_id = documentType ? documentType.id : null;
        data.workflow_pos_x = editor.canvas_x;
        data.workflow_pos_y = editor.canvas_y;
        axios.post(urls.store_work_flow, data)
            .then(res => {
                alert.show('Lưu thành công');
            })
            .catch(err => {
                alert.show('Có lỗi xảy ra');
            });

    };


    return (<div className={"flow"}>
            <aside className="flow__sidebar">
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="dark" onClick={() => setShowModal(true)}>
                        <AiOutlineSelect size={"25"}/> Chọn loại tài liệu
                    </Button>
                </div>
                {documentType && renderType(documentType)}
                {documentType && <Node urls={urls} drag={drag} tableId={tableId}/>}
                <FlowTool editor={editor} handleSave={handleSave}/>
            </aside>
            <main id={"draw-main"} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chọn loại tài liệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FlowList list={listDocumentTypes} clickHandle={onClickSelectDocumentType}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FlowChart;