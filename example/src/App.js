import React from 'react'

import '@tuoitre/flowchart-builder/dist/index.css'
import {TTFlow} from '@tuoitre/flowchart-builder'

const App = () => {
    let urls = {
        get_list_document_types: 'https://document.tuoitre.vn/api/document-type/get-document-types',
        get_one_document_type: 'https://document.tuoitre.vn/api/document-type/get',
        get_workflow_detail: 'https://workflow.tuoitre.vn/api/workflow/detail',
        store_work_flow: 'https://workflow.tuoitre.vn/api/workflow/store',
        get_list_departments: 'https://employee.tuoitre.vn/api/departments',
        get_list_positions: 'https://employee.tuoitre.vn/api/positions',
        get_list_actions: 'https://employee.tuoitre.vn/api/list/actions/dep/pos/tab'
    };

    let tableId = 11;

    return <TTFlow urls={urls} tableId={tableId}/>
}

export default App
