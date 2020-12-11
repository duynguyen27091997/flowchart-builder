import DrawFlow from "../helper/Drawflow";
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

const useFlowChart = (idElement, classElement) => {
    let [editor, setEditor] = useState(null);
    //set up editor

    useEffect(() => {
        let id = document.getElementById(idElement);
        if (!editor)
            setEditor(new DrawFlow(id));
        else {
            id.addEventListener('drop', drop, false)
            id.addEventListener('dragover', allowDrop, false)
        }
        // bindEvent(editor)
        let elements = document.getElementsByClassName(classElement)
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('dragstart', drag, false);
        }

    }, [classElement, editor, idElement])
    useEffect(() => {
        if (editor) {
            editor.start();
        }
    }, [editor])


    const allowDrop = (ev) => {
        ev.preventDefault()
    }

    const drag = (ev) => {
        console.log("drag")
        ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));

    }

    const addNodeToDrawFlow = (data, pos_x, pos_y) => {
        if (editor.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

        let template = `
            <div>
              <div class="title-box"><i class="fas fa-code"></i> Thông tin</div>
                  <div class="box">
                    <p>Chức vụ</p>
                    <p>Action</p>
                  </div>
            </div>
            `;
        editor.addNode('template', 1, 1, pos_x, pos_y, 'template', {"template": 'Write your template'}, template);

    }

    const drop = (ev) => {
        console.log('drop')
        console.log(editor)
        let data = ev.dataTransfer.getData("node");
        addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }


    return editor;
};

export default useFlowChart;


