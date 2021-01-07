import React, {useState,useEffect} from 'react';

const CreateWorkflow = ({workflow,listType,createWorkflow}) => {
        let template = {
            workflow_name: '',
            workflow_description: '',
            workflow_type: '',
        };

        useEffect(()=>{
          if(workflow && workflow.type)
          setValue({...value, workflow_type: workflow.type})
        },[workflow])

        let [value, setValue] = useState(template);
        const handleChange = (e) => {
            setValue({...value, [e.target.name]: e.target.value})
        }

        return (
            <div>
                <div className={"form-group"}>
                    <label>Workflow name</label>
                    <input type="text" placeholder={'Tiêu đề'}
                           value={value.workflow_name}
                           onChange={handleChange}
                           name={'workflow_name'}/>
                </div>
                <div className={"form-group"}>
                    <label>Workflow description</label>
                    <input type="text" placeholder={'Mô tả'}
                           value={value.workflow_description}
                           onChange={handleChange}
                           name={'workflow_description'}/>
                </div>
                <div className={"form-group"}>
                    <label>Workflow type</label>
                    <select name="workflow_type" value={value.workflow_type} onChange={handleChange}>
                        <option value="" disabled>...</option>
                        {listType.map((item, index) => {
                            return <option value={item.value} key={index}>{item.label}</option>
                        })}
                    </select>
                </div>
                <div className={"form-group"}>
                    <button onClick={()=>createWorkflow(value)} type={'button'} className={"btn button-default btn-submit"}>Tạo workflow</button>
                </div>
            </div>
        );
    }
;

export default CreateWorkflow;