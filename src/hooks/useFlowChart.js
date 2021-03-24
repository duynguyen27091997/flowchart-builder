import DrawFlow from "../helpers/Drawflow";
import {useState, useEffect} from "react";
import {useAlert} from 'react-alert';
import _ from 'lodash'

// function bindEvent(editor) {
//     // Events!
//     editor.on('nodeCreated', function (id) {
//         console.log("Node created " + id);
//     })
//
//     editor.on('nodeRemoved', function (id) {
//         console.log("Node removed " + id);
//     })
//
//     editor.on('nodeSelected', function (id) {
//         console.log("Node selected " + id);
//     })
//
//     editor.on('moduleCreated', function (name) {
//         console.log("Module Created " + name);
//     })
//
//     editor.on('moduleChanged', function (name) {
//         console.log("Module Changed " + name);
//     })
//
//     editor.on('connectionCreated', function (connection) {
//         console.log('Connection created');
//         console.log(connection);
//     })
//
//     editor.on('connectionRemoved', function (connection) {
//         console.log('Connection removed');
//         console.log(connection);
//     })
//
//     editor.on('mouseMove', function (position) {
//         console.log('Position mouse x:' + position.x + ' y:' + position.y);
//     })
//
//     editor.on('nodeMoved', function (id) {
//         console.log("Node moved " + id);
//     })
//
//     editor.on('zoom', function (zoom) {
//         console.log('Zoom level ' + zoom);
//     })
//
//     editor.on('translate', function (position) {
//         console.log('Translate x:' + position.x + ' y:' + position.y);
//     })
//
//     editor.on('addReroute', function (id) {
//         console.log("Reroute added " + id);
//     })
//
//     editor.on('removeReroute', function (id) {
//         console.log("Reroute removed " + id);
//     })
//
// }

const useFlowChart = (workflowId) => {
    let alert = useAlert();
    let [editor, setEditor] = useState(null);

    useEffect(() => {
        let id = document.getElementById('draw-main');
        if (!editor && id) {
            setEditor(new DrawFlow(id, workflowId));
        }
    }, [editor, workflowId])


    const allowDrop = (ev) => {
        ev.preventDefault()
    }

    const drag = (data, event) => {
        event.dataTransfer.setData("node", JSON.stringify(data));
    }

    const drop = event => {
        let data = event.dataTransfer.getData("node");
        addNodeToDrawFlow(JSON.parse(data), event.clientX, event.clientY);
    }

    const addNodeToDrawFlow = (data, pos_x, pos_y) => {

        if (editor.editor_mode === 'fixed') {
            return false;
        }

        if ((!data.action || !data.name)) {
            alert.show('Chưa nhập đủ trường cần thiết');
            return false;
        }
        // if ((!data.action || !data.name) || (data.mode === 'department-position' && (!data.department || !data.position))) {
        //     alert.show('Chưa nhập đủ trường cần thiết');
        //     return false;
        // }

        if ((editor.workflow.steps.findIndex(item => item.is_first === true) !== -1) && data.is_first) {
            alert.show('Đã tồn tại bước bắt đầu !');
            return false;
        }

        pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

        let template = `<div><div class="title-box"><h6 class="mt-1"><strong>Tên:</strong> ${_.get(data, 'name', '')}</h6><p class="mt-2"><strong>Mô tả:</strong> ${_.get(data, 'description', '')}</p></div><div class="box"><p class="box__target">Phòng ban: ${_.get(data, 'department.name', 'Bất kỳ')}</p><p class="box__action">Chức vụ: ${_.get(data, 'position.name', 'Bất kỳ')}</p><p class="box__action">Hành động: ${data.action.name}</p><p>Mô tả</p>${data.current_process_user_is_target ? '<p>Lấy người đang thực hiện làm đối tượng cụ thể</p>' : ''}${data.same_department_on_step ? `<p>Đối tượng có liên hệ tới bước: ${data.same_department_on_step.name}</p>` : ''}${data.same_target_on_step ? `<p>Đối tượng lấy từ bước: ${data.same_target_on_step.name}</p>` : ''}</div></div>`;
        editor.addNode(data, pos_x, pos_y, template);
    }


    return [editor, drag, drop, allowDrop];
};

export default useFlowChart;


