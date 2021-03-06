import React from 'react';
import {FaSearch, FaSearchMinus, FaSearchPlus} from "react-icons/fa";

const FlowTool = props => {
    let {
        editor,
        handleSave,
        checkPermission
    } = props;
    return (
        <div>
            <div>
                {checkPermission && checkPermission('delete') && <div className="btn-clear" style={{userSelect: 'none'}} onClick={() => editor.clear()}>Xóa</div>}
                {checkPermission && (checkPermission('create') || checkPermission('update')) && <div className="btn-save" style={{userSelect: 'none'}} onClick={() => {handleSave(editor.export())}}>Lưu</div>}
            </div>
            <div className="bar-zoom">
                <FaSearchMinus onClick={() => editor.zoom_out()}/>
                <FaSearchPlus onClick={() => editor.zoom_in()}/>
                <FaSearch onClick={() => editor.zoom_reset()}/>
            </div>
        </div>
    );
};

export default FlowTool;