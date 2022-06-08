import React from 'react';
import './style.scss';

const ListDocumentType = ({documentTypes, onSelect, hasParent = false}) => {
    return (
        <div className="list-type-select">
            <ol className="dd-list">
                {
                    documentTypes.map((item, index) =>
                        <li
                            className={`dd-item ${item.children && item.children.length > 0 && 'dd-parent'}`}
                            onClick={() => hasParent && onSelect(item)}
                            key={index}>
                            <div
                                className={`dd-handle ${item.children && item.children.length > 0 && 'parent-title'}`}>
                                {item.display_name}
                            </div>
                            {
                                item.children
                                && item.children.length > 0
                                && <ListDocumentType documentTypes={item.children} onSelect={onSelect} hasParent={true}/>
                            }
                        </li>)
                }
            </ol>
        </div>
    );
};

export default ListDocumentType;
