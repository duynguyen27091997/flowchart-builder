import DrawFlow from "../helpers/Drawflow";
import {useState, useEffect} from "react";


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
    let [editor, setEditor] = useState(null);
    //set up editor

    useEffect(() => {
        let id = document.getElementById(workflowId);
        if (!editor && id) {
            setEditor(new DrawFlow(id, workflowId));
        }
    }, [editor])


    const allowDrop = (ev) => {
        ev.preventDefault()
    }

    const drag = (value,ev) => {
        ev.dataTransfer.setData("node", JSON.stringify(value));

    }

    const addNodeToDrawFlow = (data, pos_x, pos_y) => {
        let {name="",description="",action="",target="",is_first} = data;
        if (editor.editor_mode === 'fixed') {
            return false;
        }


        if ((editor.workflow.steps.findIndex(item => item.is_first === true) !== -1) && is_first){
            alert('Đã tồn tại bước bắt đầu !');
            return false;
        }
        pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

        let template = `
            <div>
              <div class="title-box"><h6>${name}</h6>
              <p>${description}</p>
              </div>
                  <div class="box">
                    <p class="box__target">Đối tượng : ${target}</p>
                    <p class="box__action">Tác vụ : ${action}</p>
                  </div>
            </div>
            `;
        editor.addNode(data, pos_x, pos_y, template);

    }

    const drop = (ev) => {
        let data = ev.dataTransfer.getData("node");
        addNodeToDrawFlow(JSON.parse(data), ev.clientX, ev.clientY);
    }


    return [editor,drag,drop,allowDrop];
};

export default useFlowChart;


