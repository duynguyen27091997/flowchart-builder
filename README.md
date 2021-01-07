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
  return (
    <div>
      <TTFlow urls={
        {
          workflowTypesUrl : '.../api/workflow/get-workflow-types',
          storeStepsUrl:'.../api/step/store-steps',
          workflowDetailUrl:'.../api/workflow/detail?type=',
          targetTypeUrl : '.../api/step/get-action-target-types',
          actionTypeUrl : '.../api/step/get-action-types',
        }
      }/>
    </div>
  )

}
```

## Props

### urls : Object
> workflowTypesUrl : url get workflow types

> storeStepsUrl : url save workflow

> workflowDetailUrl : url get workflow detail

> targetTypeUrl : url get list target

> actionTypeUrl : url get action target
## Repo

[https://github.com/duynguyen27091997/flowchart-builder](https://github.com/duynguyen27091997/flowchart-builder)

## License

MIT © [duynguyen27091997](https://github.com/duynguyen27091997)
