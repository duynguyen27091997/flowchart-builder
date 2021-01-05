import {useState,useEffect} from 'react';
import FlowChart from "./components/FlowChart";
import axios from "axios";
import FlowList from "./components/FlowList";

function App() {
  let [listWorkflow,setListWorkflow] = useState([]);
  let [workflow,setWorkflow] = useState(null);

  useEffect(()=>{
      axios.get('https://workflow.tuoitre.vn/api/workflow/get-workflow-types')
          .then(res=>{
              if (res.status===200){
                  let tmp = Object.keys(res.data).map((key, index) => {
                      return {value: key, label: res.data[key]}
                  }, []);
                  setListWorkflow(tmp)
              }else{

              }
          })
          .catch()
  },[])
  return (
    <div className="App">
        {
            workflow ? <FlowChart workflow={workflow} />
            :
                <FlowList list={listWorkflow} selectWorkflow={(workflow)=> setWorkflow(workflow)} />
        }
    </div>
  );
}

export default App;
