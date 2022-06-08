import React,{useContext} from 'react';
import {FaSearch, FaSearchMinus, FaSearchPlus} from "react-icons/fa";
import {canDo} from "../../helpers/permission";
import FlowContext from "../../flow-context";

const FlowTool = ({onSave}) => {
    const {editor, permissions} = useContext(FlowContext)
    return (
        <div>
            <div>
                {<div className="btn-clear" style={{userSelect: 'none'}} onClick={() => editor.clear()}>Xóa</div>}
                {<div className="btn-save" style={{userSelect: 'none'}} onClick={onSave}>Lưu</div>}
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
