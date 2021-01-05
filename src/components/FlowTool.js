import React from 'react';
import {FaSearch, FaSearchMinus, FaSearchPlus} from "react-icons/fa";

const FlowTool = ({editor, handleSave}) => {
    return (
        <div>
            <div>
                <div className="btn-clear" style={{userSelect: 'none'}} onClick={() => editor.clear()}>Xóa</div>
                <div className="btn-save" style={{userSelect: 'none'}} onClick={() => {
                    handleSave(editor.export())
                }}>Lưu
                </div>
            </div>
            {/*<div className="btn-lock">*/}
            {/*    {(editor && editor.editor_mode === 'edit') ? <FaLock onClick={() => {*/}
            {/*            editor.lock();*/}
            {/*        }}/> :*/}
            {/*        <FaLockOpen onClick={() => {*/}
            {/*            editor.unlock();*/}
            {/*        }}/>*/}
            {/*    }*/}
            {/*</div>*/}
            <div className="bar-zoom">
                <FaSearchMinus onClick={() => editor.zoom_out()}/>
                <FaSearchPlus onClick={() => editor.zoom_in()}/>
                <FaSearch onClick={() => editor.zoom_reset()}/>
            </div>
        </div>
    );
};

export default FlowTool;