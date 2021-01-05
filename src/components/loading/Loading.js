import React from 'react';
import './Loading.scss';

const Loading = ({show =false}) => {
    return (
        <div className={'overlay-loading'} style={{display:show ? 'flex':'none'}}>
            <div className="lds-ripple">
                <div/>
                <div/>
            </div>
        </div>
    );
};

export default Loading;