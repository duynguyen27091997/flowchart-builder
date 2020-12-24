import React from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';

import Node from "./Node";
import FlowTool from "./FlowTool";

const FlowChart = ({workflowId=1}) => {

    let [editor,drag,drop,allowDrop] = useFlowChart(workflowId)

    if(editor) {
        editor.import({"steps":[{"step_id":2,"workflow_id":1,"description":"Phòng nhân sự tạo hồ sơ cho nhân viên","name":"Tạo hồ sơ","html":"<div><div class=\"title-box\"><h6>Tạo hồ sơ</h6><p>Phòng nhân sự tạo hồ sơ cho nhân viên</p></div><div class=\"box\"><p class=\"box__target\">Đối tượng chung: Phòng ban</p><p class=\"box__action\">Tác vụ : Tạo</p><p class=\"box__action\">Đối tượng cụ thể : <br><strong> Leanne Graham</strong></p></div></div>","is_first":true,"inputs":[],"actions":[{"name":"create","target_type":"department","pass":"3","reject":null}],"targets":[{"id":1,"name":"Leanne Graham","type":"department","action":"create"}],"pos_x":123,"pos_y":79},{"step_id":3,"workflow_id":1,"description":"Nhân viên xem & sửa thông tin","name":"Nhân viên cập nhật hồ sơ","html":"<div><div class=\"title-box\"><h6>Nhân viên cập nhật hồ sơ</h6><p>Nhân viên xem & sửa thông tin</p></div><div class=\"box\"><p class=\"box__target\">Đối tượng chung: Cá nhân</p><p class=\"box__action\">Tác vụ : Cập nhật</p><p class=\"box__action\">Đối tượng cụ thể : <br><strong> Leanne Graham</strong></p></div></div>","is_first":false,"inputs":[{"name":"input_default","steps":[{"step_id":"2","output":"create_output_pass"}]}],"actions":[{"name":"update","target_type":"personal","pass":"4","reject":null}],"targets":[{"id":1,"name":"Leanne Graham","type":"personal","action":"update"}],"pos_x":582,"pos_y":109},{"step_id":4,"workflow_id":1,"description":"Phòng nhân sự xem xét, lưu thông tin đã chỉnh sửa từ nhân viên","name":"Phòng Nhân sự lưu hồ sơ","html":"<div><div class=\"title-box\"><h6>Phòng Nhân sự lưu hồ sơ</h6><p>Phòng nhân sự xem xét, lưu thông tin đã chỉnh sửa từ nhân viên</p></div><div class=\"box\"><p class=\"box__target\">Đối tượng chung: Phòng ban</p><p class=\"box__action\">Tác vụ : Xác nhận</p><p class=\"box__action\">Đối tượng cụ thể : <br><strong> Leanne Graham</strong></p></div></div>","is_first":false,"inputs":[{"name":"input_default","steps":[{"step_id":"3","output":"update_output_pass"}]}],"actions":[{"name":"confirm","target_type":"department","pass":null,"reject":null}],"targets":[{"id":1,"name":"Leanne Graham","type":"department"}],"pos_x":965,"pos_y":96}]});
    }
    return (
        <div className={"flow"}>
            <aside className="flow__sidebar">
                <Node drag={drag}/>
                <FlowTool editor={editor}/>
            </aside>
            <main  id={workflowId} className="flow__draw" onDragOver={allowDrop} onDrop={drop}/>
        </div>

    );
};

export default FlowChart;