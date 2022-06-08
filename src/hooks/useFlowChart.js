import DrawFlow from "../helpers/Drawflow";
import {useState, useEffect} from "react";
import {useAlert} from 'react-alert';

const useFlowChart = workflowId => {
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

        if (!data.name) {
            alert.show('Tên step không được để trống');
            return false;
        }

        if (!Object.keys(data.targets).length) {
            alert.show('Chưa chọn đối tượng');
            return false;
        }

        if ((editor.workflow.steps.findIndex(item => item.is_first === true) !== -1) && data.is_first) {
            alert.show('Đã tồn tại bước bắt đầu !');
            return false;
        }

        pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

        editor.addNode(data, pos_x, pos_y);
    }


    return [editor, drag, drop, allowDrop];
};

export default useFlowChart;


