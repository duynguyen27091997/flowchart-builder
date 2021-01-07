import React, {useState} from 'react';

const CreateWorkflow = ({initData={name:'',description:'',type:''},listType,createWorkflow}) => {


        let [value, setValue] = useState(initData);
        const handleChange = (e) => {
            setValue({...value, [e.target.name]: e.target.value})
        }

        return (
            <div>
                <div className={"form-group"}>
                    <label>Workflow name</label>
                    <input type="text" placeholder={'Tiêu đề'}
                           value={value.name}
                           onChange={handleChange}
                           name={'name'}/>
                </div>
                <div className={"form-group"}>
                    <label>Workflow description</label>
                    <input type="text" placeholder={'Mô tả'}
                           value={value.description}
                           onChange={handleChange}
                           name={'description'}/>
                </div>
                <div className={"form-group"}>
                    <label>Workflow type</label>
                    <select name="type" value={value.type} onChange={handleChange}>
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