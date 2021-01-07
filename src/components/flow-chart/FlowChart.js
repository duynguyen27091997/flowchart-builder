import React, { useEffect, useState } from "react";
import useFlowChart from "../../hooks/useFlowChart";
import "./FlowChart.scss";

import axios from "axios";
import Node from "../node/Node";
import FlowTool from "../flow-tool/FlowTool";
import { AiOutlineRollback } from "react-icons/ai";
import Loading from "../loading/Loading";


const FlowChart = ({
                     workflow = null,
                     unselectWorkflow,
                     storeStepsUrl,
                     targetTypesUrl,
                     actionTypeUrl
                   }) => {

  let [editor, drag, drop, allowDrop] = useFlowChart();
  let [loading, setLoading] = useState(false);

  const getData = async () => {
    const targets = await axios(targetTypesUrl).then(res => res.data);
    const actions = await axios(actionTypeUrl).then(res => res.data);
    return [targets, actions];
  };

  useEffect(() => {
    if (editor) {
      if (workflow.steps) {
        editor.import(workflow);
      } else {
        editor.start();
      }
    }
  }, [editor, workflow]);

  const handleSave = steps => {
    let data = {
      steps: steps.steps
    };
    //name
    data.workflow_name = workflow.workflow_name || workflow.name;

    //type
    data.workflow_type = workflow.workflow_type || workflow.type;
    //description
    data.workflow_description = workflow.workflow_description || workflow.description;

    data.workflow_pos_x = editor.pos_x;
    data.workflow_pos_y = editor.pos_y;


    axios.post(storeStepsUrl, data)
      .then(res => {
        alert('Thành công')
      })
      .catch(err => {
        alert('Có lỗi xảy ra')
      });

  };


  return (<div className={"flow"}>
      <Loading show={loading} />
      <aside className="flow__sidebar">
        <button onClick={unselectWorkflow} className={"btn btn--back"}>
          <AiOutlineRollback size={"25"} />
        </button>
        <p>Tên : {workflow.workflow_name || workflow.name}</p>
        <p>Mô tả : {workflow.workflow_description || workflow.description}</p>
        <Node drag={drag} getData={getData} />
        <FlowTool editor={editor} handleSave={handleSave} />
      </aside>
      <main id={"draw-main"} className="flow__draw" onDragOver={allowDrop} onDrop={drop} />
    </div>
  );
};

export default FlowChart;