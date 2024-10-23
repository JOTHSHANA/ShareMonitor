import React from 'react';
import {
    AutoFixHigh as AutoFixHighIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    KeyboardDoubleArrowUp as KeyboardDoubleArrowUpIcon,
    KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon,
    DeleteForeverSharp as DeleteForeverSharpIcon
} from '@mui/icons-material';
import pdf_img from '../../assets/pdf_img.png';
import video_img from '../../assets/video_img.png';
import link_img from '../../assets/link_img.png';
import general_doc_img from '../../assets/general_doc_img.png';

const DocumentManager = ({
    documentEditDeleteRef,
    showDocumentEditDelete,
    handleShowDocumentEditDelete,
    handleDocumentPopupOpen,
    isLoading,
    documents,
    apiHost,
    empty_folder,
    handleMoveUp,
    handleMoveDown,
    handleDocumentDelete,
    showDocUndoAlert,
    handleDocUndo
}) => {
    return (
        <div ref={documentEditDeleteRef} className='documents-div'>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    className={`add-button ${showDocumentEditDelete ? "cancel-button" : "modify-button"}`}
                    onClick={handleShowDocumentEditDelete}
                >
                    {showDocumentEditDelete ? (
                        <CancelIcon sx={{ marginRight: "5px", fontSize: "20px" }} />
                    ) : (
                        <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} />
                    )}
                    <span>{showDocumentEditDelete ? "Cancel" : "Modify"}</span>
                </button>

                <button className='add-button' onClick={handleDocumentPopupOpen}>
                    <AddIcon /><span>Add Document</span>
                </button>
            </div>
            <hr />

            {isLoading ? (
                <div className="no-subjects-text" style={{ height: "80%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0px" }}>
                        <img style={{ height: "120px" }} src={empty_folder} alt="No Folders" />
                        <p style={{ fontWeight: "600" }}>No documents added</p>
                        <button className='add-button' onClick={handleDocumentPopupOpen}>
                            <AddIcon /><span>Add Document</span>
                        </button>
                    </div>
                </div>
            ) : documents.length > 0 ? (
                documents.map((doc, index) => (
                    <div style={{ display: "flex", gap: "5px" }} key={index}>
                        <div className='index-box' style={{ padding: "12px" }}>{index + 1}</div>
                        <div className='document-item' style={{ flex: "1" }}>
                            {doc.pdf && (
                                <div className='flex-align'>
                                    <img src={pdf_img} alt="PDF" className="document-icon" />
                                    <a href={`${apiHost}${doc.pdf}`} target="_blank" rel="noopener noreferrer">
                                        {doc.file_name}
                                    </a>
                                </div>
                            )}
                            {doc.video && (
                                <div className='flex-align'>
                                    <img src={video_img} alt="Video" className="document-icon" />
                                    <a href={`${apiHost}${doc.video}`} target="_blank" rel="noopener noreferrer">
                                        {doc.file_name}
                                    </a>
                                </div>
                            )}
                            {doc.link && (
                                <div className='flex-align'>
                                    <img src={link_img} alt="Link" className="document-icon" />
                                    <a href={doc.link} target="_blank" rel="noopener noreferrer">
                                        {doc.link}
                                    </a>
                                </div>
                            )}
                            {doc.general_doc && (
                                <div className='flex-align'>
                                    <img src={general_doc_img} alt="General Document" className="document-icon" />
                                    <a href={`${apiHost}${doc.general_doc}`} target="_blank" rel="noopener noreferrer">
                                        {doc.file_name}
                                    </a>
                                </div>
                            )}
                            <div style={{ display: "flex", gap: "5px" }}>
                                <button
                                    className='add-button-document'
                                    onClick={() => handleMoveUp(doc.id, documents[index - 1]?.id, index, index - 1)}
                                    disabled={index === 0}
                                >
                                    <KeyboardDoubleArrowUpIcon sx={{ color: "var(--text)" }} />
                                </button>
                                <button
                                    className='add-button-document'
                                    onClick={() => handleMoveDown(doc.id, documents[index + 1]?.id, index, index + 1)}
                                    disabled={index === documents.length - 1}
                                >
                                    <KeyboardDoubleArrowDownIcon sx={{ color: "var(--text)" }} />
                                </button>
                                <div
                                    className="hover-edit-delete-documents"
                                    style={{ display: showDocumentEditDelete ? 'flex' : 'none' }}
                                >
                                    <div
                                        className="delete-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDocumentDelete(doc.id);
                                        }}
                                    >
                                        <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-subjects-text" style={{ height: "80%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0px" }}>
                        <img style={{ height: "120px" }} src={empty_folder} alt="No Folders" />
                        <p style={{ fontWeight: "600" }}>No documents added</p>
                        <button className='add-button' onClick={handleDocumentPopupOpen}>
                            <AddIcon /><span>Add Document</span>
                        </button>
                    </div>
                </div>
            )}
            {showDocUndoAlert && (
                <div className="undo-alert">
                    <span>Document deleted. </span>
                    <button onClick={handleDocUndo}>Undo</button>
                </div>
            )}
        </div>
    );
};

export default DocumentManager;
