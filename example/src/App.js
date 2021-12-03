import React from 'react'

import '@tuoitre/flowchart-builder/dist/index.css'
import {TTFlow} from '@tuoitre/flowchart-builder'

const App = () => {
    let urls = {
        get_list_document_types: 'http://document.erp.ez:81/api/document-type/get-document-types',
        get_one_document_type: 'http://document.erp.ez:81/api/document-type/get',
        get_workflow_detail: 'http://workflow.erp.ez:81/api/workflow/get',
        store_work_flow: 'http://workflow.erp.ez:81/api/workflow/store',
        get_list_departments: 'https://employee.tuoitre.vn/api/departments',
        get_list_positions: 'https://employee.tuoitre.vn/api/positions',
        get_list_actions_by_post_dep: 'https://employee.tuoitre.vn/api/permission/departments/positions',
        get_list_actions_by_post: 'https://employee.tuoitre.vn/api/list/permission/work-formality',
    };

    let permissions = [{action: 'view'}, {action: 'create'}, {action: 'delete'}];
    let user = {
        name: 'Giang Nguyen',
        id: 15
    };

    return <TTFlow urls={urls} user={user} permissions={permissions}/>
}

export default App
