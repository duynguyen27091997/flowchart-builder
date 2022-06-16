import React, {useEffect, useState} from 'react'

import '@tuoitre/flowchart-builder/dist/index.css'
import {TTFlow} from '@tuoitre/flowchart-builder'
import axios from "axios";

const App = () => {

    const [types, setTypes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        (async () => {
            const documentTypesRes = await axios.get('http://document.erp.ez:81/api/document-type/get-document-types');
            const departmentsRes = await axios.get('http://192.168.61.116/api/departments?per_page=1000');
            const positionsRes = await axios.get('http://192.168.61.116/api/positions?per_page=1000');
            setTypes(documentTypesRes.data);
            setDepartments(departmentsRes.data.data)
            setPositions(positionsRes.data.data)
        })()
    }, [])

    const handleSaveWorkflow = (documentTypeId, data) => {
        axios.post('http://workflow.erp.ez:81/api/workflow/store/' + documentTypeId, {
            ...data,
            creator_id: 15,
            creator_name: 'Giang Nguyen'
        })
    }

    const getWorkflowHandle = documentTypeId => {

    }

    return <TTFlow
        document_types={types}
        permissions={[{action: 'view'}, {action: 'create'}, {action: 'delete'}]}
        departments={departments}
        positions={positions}
        onSave={handleSaveWorkflow}
        getWorkflowHandle={getWorkflowHandle}/>
}

export default App
