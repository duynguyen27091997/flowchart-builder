# @tuoitre/flowchart-builder

<div align="center"> 
    <img src="https://cdn.tgdd.vn/GameApp/3/222501/Screentshots/bao-tuoi-tre-online-222501-logo-13-05-2020.png" alt="">
    <h3>Flowchart Builder for TuoiTre ERP </h3> 
</div>


[![NPM](https://img.shields.io/npm/v/@tuoitre/flowchart-builder.svg)](https://www.npmjs.com/package/@tuoitre/flowchart-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install @tuoitre/flowchart-builder
```
or
```bash
yarn add @tuoitre/flowchart-builder
```

## Usage

```jsx
import React from 'react'

import { TTFlow } from '@tuoitre/flowchart-builder'
import '@tuoitre/flowchart-builder/dist/index.css'

const Example = () => {
    let permissions = [];
  return (
    <div>
      <TTFlow urls={
        {
            get_list_document_types: '{domain}/api/document-type/get-document-types',
            get_one_document_type: '{domain}/api/document-type/get',
            get_workflow_detail: '{domain}/api/workflow/detail',
            store_work_flow: '{domain}/api/workflow/store',
            get_list_departments: '{domain}/api/list/departments',
            get_list_positions: '{domain}/api/list/positions',
            get_list_actions_by_post_dep: '{domain}/api/permission/departments/positions',
            get_list_actions_by_post: '{domain}/api/list/permission/work-formality',
        }
      } tableId={11} permissions={permissions}/>
    </div>
  )

}
```

## Props

### urls : Object
> get_list_document_types : url get list document type

> get_one_document_type : url get single document typr

> get_workflow_detail : url get workflow detail

> store_work_flow : url store workflow with step

> get_list_departments : url get list departments

> get_list_positions : url get list positions

> get_list_actions_by_post_dep : url get list action by department and position

> get_list_actions_by_post : url get list action by position

> tableId: id of table Workflow on service-management
> 
## Repo

[https://github.com/duynguyen27091997/flowchart-builder](https://github.com/duynguyen27091997/flowchart-builder)

## License

MIT © [duynguyen27091997](https://github.com/duynguyen27091997)
