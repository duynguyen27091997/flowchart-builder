import React from "react";
import FlowChart from "./flow-chart/FlowChart";
import 'bootstrap/dist/css/bootstrap.min.css';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 3000,
    offset: '30px',
    transition: transitions.SCALE
}

function Flow(props) {
    return (
        <AlertProvider template={AlertTemplate} {...options}>
            <div className="flow-container">
                <FlowChart {...props}/>
            </div>
        </AlertProvider>
    );
}

export default Flow;
