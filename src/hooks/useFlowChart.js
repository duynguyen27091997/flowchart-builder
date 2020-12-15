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
        if (!editor)
            setEditor(new DrawFlow(id,workflowId));
        // else {
        //     id.addEventListener('drop', drop, false)
        //     id.addEventListener('dragover', allowDrop, false)
        // }
        // bindEvent(editor)
        // let elements = document.getElementsByClassName(classElement)
        // for (let i = 0; i < elements.length; i++) {
        //     elements[i].addEventListener('dragstart', drag, false);
        // }

    }, [ editor])
    useEffect(() => {
        if (editor) {
            editor.start();
        }
    }, [editor])


    const allowDrop = (ev) => {
        ev.preventDefault()
    }

    const drag = (ev) => {

        let currentNode = ev.target;
        let name = currentNode.getAttribute('data-name');
        let description = currentNode.getAttribute('data-description')
        let action = currentNode.getAttribute('data-action')
        let target = currentNode.getAttribute('data-target')
        ev.dataTransfer.setData("node", JSON.stringify({name,description,action,target}));

    }

    const addNodeToDrawFlow = ({name="",description="",action="",target=""}, pos_x, pos_y) => {
        if (editor.editor_mode === 'fixed') {
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
        let extraData = {};
        editor.addNode({name,description,action,target}, pos_x, pos_y, extraData, template);

    }

    const drop = (ev) => {
        let data = ev.dataTransfer.getData("node");
        addNodeToDrawFlow(JSON.parse(data), ev.clientX, ev.clientY);
    }


    return [editor,drag,drop,allowDrop];
};

export default useFlowChart;


