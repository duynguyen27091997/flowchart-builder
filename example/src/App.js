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
        get_list_actions_by_post_dep: 'https://employee.tuoitre.vn/api/permission/departments/positions',
        get_list_actions_by_post: 'https://employee.tuoitre.vn/api/list/permission/work-formality',
    };

    let tableId = 11;

    let permissions = [{action:'view'}, {action:'create'},{action:'delete'}];

    return <TTFlow urls={urls} tableId={tableId} permissions={permissions}/>
}

export default App
