import React from 'react';
import useFlowChart from "../hooks/useFlowChart";
import './FlowChart.scss';

import Node from "./Node";
import FlowTool from "./FlowTool";

const FlowChart = ({workflowId=1}) => {

    let [editor,drag,drop,allowDrop] = useFlowChart(workflowId)

    if(editor) {
        editor.import({
            "steps": [
                {
                    "step_id": 1,
                    "workflow_id": 1,
                    "description": "Đề xuất",
                    "name": "Đề xuất",
                    "html": "\n            <div>\n              <div class=\"title-box\"><h6>Đề xuất</h6>\n              <p>Đề xuất</p>\n              </div>\n                  <div class=\"box\">\n                    <p class=\"box__target\">Đối tượng : personal</p>\n                    <p class=\"box__action\">Tác vụ : create</p>\n                  </div>\n            </div>\n            ",
                    "is_first": true,
                    "inputs": [],
                    "actions": [
                        {
                            "name": "create",
                            "target_type": "personal",
                            "pass": "5",
                            "reject": null
                        }
                    ],
                    "targets": [
                        {
                            "id": "",
                            "name": "",
                            "type": "personal",
                            "action": "create"
                        }
                    ],
                    "pos_x": 17,
                    "pos_y": 93
                },
                {
                    "step_id": 5,
                    "workflow_id": 1,
                    "description": "Trưởng ban",
                    "name": "Trưởng ban",
                    "html": "\n            <div>\n              <div class=\"title-box\"><h6>Trưởng ban</h6>\n              <p>Trưởng ban</p>\n              </div>\n                  <div class=\"box\">\n                    <p class=\"box__target\">Đối tượng : chairman</p>\n                    <p class=\"box__action\">Tác vụ : confirm</p>\n                  </div>\n            </div>\n            ",
                    "is_first": false,
                    "inputs": [
                        {
                            "name": "input_default",
                            "steps": [
                                {
                                    "step_id": "1",
                                    "output": "create_output_pass"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "confirm",
                            "target_type": "chairman",
                            "pass": "6",
                            "reject": null
                        }
                    ],
                    "targets": [
                        {
                            "id": "",
                            "name": "",
                            "type": "chairman",
                            "action": "confirm"
                        }
                    ],
                    "pos_x": 405,
                    "pos_y": 83
                },
                {
                    "step_id": 6,
                    "workflow_id": 1,
                    "description": "Văn phòng",
                    "name": "Văn phòng",
                    "html": "\n            <div>\n              <div class=\"title-box\"><h6>Văn phòng</h6>\n              <p>Văn phòng</p>\n              </div>\n                  <div class=\"box\">\n                    <p class=\"box__target\">Đối tượng : office</p>\n                    <p class=\"box__action\">Tác vụ : confirm</p>\n                  </div>\n            </div>\n            ",
                    "is_first": false,
                    "inputs": [
                        {
                            "name": "input_default",
                            "steps": [
                                {
                                    "step_id": "5",
                                    "output": "confirm_output_pass"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "confirm",
                            "target_type": "office",
                            "pass": "7",
                            "reject": "8"
                        }
                    ],
                    "targets": [
                        {
                            "id": "",
                            "name": "",
                            "type": "office",
                            "action": "confirm"
                        }
                    ],
                    "pos_x": 840,
                    "pos_y": 73
                },
                {
                    "step_id": 7,
                    "workflow_id": 1,
                    "description": "Kho",
                    "name": "Kho",
                    "html": "\n            <div>\n              <div class=\"title-box\"><h6>Kho</h6>\n              <p>Kho</p>\n              </div>\n                  <div class=\"box\">\n                    <p class=\"box__target\">Đối tượng : warehouse</p>\n                    <p class=\"box__action\">Tác vụ : confirm</p>\n                  </div>\n            </div>\n            ",
                    "is_first": false,
                    "inputs": [
                        {
                            "name": "input_default",
                            "steps": [
                                {
                                    "step_id": "6",
                                    "output": "confirm_output_pass"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "confirm",
                            "target_type": "warehouse",
                            "pass": "9",
                            "reject": null
                        }
                    ],
                    "targets": [
                        {
                            "id": "",
                            "name": "",
                            "type": "warehouse",
                            "action": "confirm"
                        }
                    ],
                    "pos_x": 1337,
                    "pos_y": -90
                },
                {
                    "step_id": 8,
                    "workflow_id": 1,
                    "description": "Trưởng ban",
                    "name": "Trưởng ban",
                    "html": "\n            <div>\n              <div class=\"title-box\"><h6>Trưởng ban</h6>\n              <p>Trưởng ban</p>\n              </div>\n                  <div class=\"box\">\n                    <p class=\"box__target\">Đối tượng : chairman</p>\n                    <p class=\"box__action\">Tác vụ : view</p>\n                  </div>\n            </div>\n            ",
                    "is_first": false,
                    "inputs": [
                        {
                            "name": "input_default",
                            "steps": [
                                {
                                    "step_id": "6",
                                    "output": "confirm_output_reject"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "view",
                            "target_type": "chairman",
                            "pass": null,
                            "reject": null
                        }
                    ],
                    "targets": [
                        {
                            "id": "",
                            "name": "",
                            "type": "chairman",
                            "action": "view"
                        }
                    ],
                    "pos_x": 1356,
                    "pos_y": 264
                },
                {
                    "step_id": 9,
                    "workflow_id": 1,
                    "description": "Người đề xuất xuống kho nhận",
                    "name": "Người đề xuất xuống kho nhận",
                    "html": "\n            <div>\n              <div class=\"title-box\"><h6>Người đề xuất xuống kho nhận</h6>\n              <p>Người đề xuất xuống kho nhận</p>\n              </div>\n                  <div class=\"box\">\n                    <p class=\"box__target\">Đối tượng : personal</p>\n                    <p class=\"box__action\">Tác vụ : confirm</p>\n                  </div>\n            </div>\n            ",
                    "is_first": false,
                    "inputs": [
                        {
                            "name": "input_default",
                            "steps": [
                                {
                                    "step_id": "7",
                                    "output": "confirm_output_pass"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "confirm",
                            "target_type": "personal",
                            "pass": null,
                            "reject": null
                        }
                    ],
                    "targets": [
                        {
                            "id": "",
                            "name": "",
                            "type": "personal",
                            "action": "confirm"
                        }
                    ],
                    "pos_x": 1769,
                    "pos_y": -113
                }
            ]
        });
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