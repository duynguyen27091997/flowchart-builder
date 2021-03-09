import React from 'react'

import '@tuoitre/flowchart-builder/dist/index.css'
import {TTFlow} from '@tuoitre/flowchart-builder'

const App = () => {
    let urls = {
        get_list_document_types: 'https://document.tuoitre.vn/api/document-type/get-document-types',
        get_one_document_type: 'https://document.tuoitre.vn/api/document-type/get',
        get_workflow_detail: 'https://workflow.tuoitre.vn/api/workflow/detail',
        store_work_flow: 'http://workflow.tuoitre.vn/api/workflow/store',
    };
    return <TTFlow urls={urls}/>
}

export default App
