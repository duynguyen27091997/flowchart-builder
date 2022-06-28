import React, {useState} from "react";
import FlowChart from "./flow-chart/FlowChart";
import 'bootstrap/dist/css/bootstrap.min.css';

import {transitions, positions, Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import FlowChartContext from '../flow-context'

const alertOptions = {
    position: positions.BOTTOM_CENTER,
    timeout: 3000,
    offset: '30px',
    transition: transitions.SCALE
};

const Flow = props => {
    const [editor, setEditor] = useState(null);
    const [drag, setDrag] = useState(null);
    return (
        <FlowChartContext.Provider value={{...props, editor, setEditor, drag, setDrag}}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <div className="flow-container">
                    <FlowChart/>
                </div>
            </AlertProvider>
        </FlowChartContext.Provider>
    );
}

export default Flow;
