// import React from 'react'

// function LvlComponent() {
//     return (
//         <div>
//             <div className='container2'>
//                 <div className='level-name'>
//                     {selectedLevel ? (
//                         <>
//                             <div>
//                                 {/* <p className='level-num'>Level {selectedLevel.level}</p> */}
//                                 <p>{selectedLevel.lvl_name}</p>
//                             </div>
//                         </>
//                     ) : (
//                         <div>
//                             <p className='level-num'>Level 0</p>
//                             <p>Select a level</p>
//                         </div>
//                     )}
//                 </div>
//                 <hr />
//                 <div className='tabs'>
//                     <ul className='tabs-list'>
//                         {["ClassWorks", "HomeWorks", "Assessment", "Others"].map((tab) => (
//                             <li
//                                 key={tab}
//                                 className={`each-tab ${activeTab === tab ? "active" : ""}`}
//                                 onClick={() => handleTabClick(tab)}
//                             >
//                                 <span className="tab-icon">
//                                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                         {tab === "ClassWorks" && <LibraryBooksIcon sx={{ fontSize: "20px", color: "#0079c5", margin: "0px 5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
//                                     </div>
//                                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                         {tab === "HomeWorks" && <HomeWorkIcon sx={{ fontSize: "20px", color: "#1b6b5f", margin: "0px 5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
//                                     </div>
//                                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                         {tab === "Assessment" && <Assignment sx={{ fontSize: "20px", color: "#c7566b", margin: "0px 5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
//                                     </div>
//                                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                         {tab === "Others" && <MenuOpenIcon sx={{ fontSize: "20px", color: "#b04dc2", margin: "0px 5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
//                                     </div>
//                                 </span>
//                                 <span className="full-tab-name">{tab}</span>
//                                 <span className="short-tab-name">
//                                     {tab === "ClassWorks" ? "CW" :
//                                         tab === "HomeWorks" ? "HW" :
//                                             tab === "Assessment" ? "TEST" :
//                                                 "OTHERS"}
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>

//                 </div>

//                 <div className='all-documents'>
//                     <div className='sticky-add-button'>
//                         <div style={{ display: "flex" }}>
//                         </div>
//                         <div className='documents-container'>
//                             <div className='folders-div'>
//                                 <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
//                                     <Button
//                                         id="basic-button"
//                                         aria-controls={open ? 'basic-menu' : undefined}
//                                         aria-haspopup="true"
//                                         aria-expanded={open ? 'true' : undefined}
//                                         onClick={handleClick}
//                                     >
//                                         <MenuIcon sx={{ color: "var(--text)" }} />
//                                     </Button>
//                                     <Menu
//                                         id="basic-menu"
//                                         anchorEl={anchorEl}
//                                         open={open}
//                                         onClose={handleCloseMui}
//                                         MenuListProps={{
//                                             'aria-labelledby': 'basic-button',
//                                         }}
//                                     >
//                                         <MenuItem onClick={handleCloseMui}>
//                                             <div className='menu-icons-align' onClick={handleShowFolderEditDelete}>
//                                                 <DeleteForeverSharpIcon /><span>Delete</span>
//                                             </div>
//                                         </MenuItem>

//                                         <MenuItem onClick={handleCloseMui}>
//                                             <div className='menu-icons-align' onClick={handleNewFolderPopupOpen}>
//                                                 <AddIcon /><span>AddFolders</span>
//                                             </div>
//                                         </MenuItem>
//                                         <MenuItem onClick={handleCloseMui}>
//                                             <div className='menu-icons-align' onClick={toggleSelectMode}>
//                                                 <MergeTypeIcon />{isSelecting ? 'Cancel merge' : 'Merge'}
//                                             </div>
//                                         </MenuItem>
//                                         <MenuItem onClick={handleCloseMui}>
//                                             <div className='menu-icons-align' onClick={toggleUnmergeMode}>
//                                                 <CallSplitIcon />{isUnmerging ? 'Cancel Unmerge' : 'Unmerge'}
//                                             </div>
//                                         </MenuItem>
//                                     </Menu>
//                                 </div>
//                                 <hr />

//                                 {isLoading ? (
//                                     <div style={{ width: "100%", backgroundColor: "var(--background-1)", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                         <span className="loader"></span>
//                                     </div>
//                                 ) : folders.length > 0 ? (
//                                     folders.reduce((acc, folder, index) => {
//                                         if (folder.status === "2") {
//                                             const lastGroup = acc[acc.length - 1];

//                                             if (lastGroup && lastGroup.status === "2" && lastGroup.merge_random === folder.merge_random) {
//                                                 lastGroup.e_day = folder.s_day;
//                                             } else {
//                                                 acc.push({
//                                                     ...folder,
//                                                     e_day: folder.s_day
//                                                 });
//                                             }
//                                         } else {
//                                             acc.push(folder);
//                                         }

//                                         return acc;
//                                     }, []).map((folder, index) => (
//                                         <div
//                                             key={index}
//                                             className={`document-item ${activeFolderId === folder.id ? 'active' : ''}`}
//                                             onClick={() => fetchDocuments(folder.id)}
//                                         >
//                                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", width: "100%" }}>
//                                                 <div style={{ display: "flex" }}>
//                                                     {(isSelecting || isUnmerging) && (
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={isSelecting
//                                                                 ? (folder.id === startMergeFolderId || folder.id === endMergeFolderId)
//                                                                 : folder.id === unmergeFolderId}
//                                                             onChange={() => {
//                                                                 isSelecting
//                                                                     ? handleCheckboxChangeForMerge(folder.id)
//                                                                     : handleCheckboxChangeForUnmerge(folder.id);
//                                                             }}
//                                                             style={{ marginLeft: '10px' }}
//                                                         />
//                                                     )}
//                                                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                                                         <img src={folder_img} alt="PDF" className="document-icon" />
//                                                         {folder.s_day === folder.e_day ? (
//                                                             <span>Day {folder.s_day}</span>
//                                                         ) : (
//                                                             <span>Day {folder.s_day} - Day {folder.e_day}</span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                                 <div className='open-icon'>
//                                                     <ArrowForwardIosRoundedIcon />
//                                                 </div>
//                                                 <div
//                                                     className="hover-edit-delete-folders"
//                                                     style={{ display: showFolderEditDelete ? 'flex' : 'none' }}
//                                                 >
//                                                     <div
//                                                         className="delete-icon"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleFolderDelete(folder.id);
//                                                         }}
//                                                     >
//                                                         <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>No folders added.</p>
//                                 )}

//                                 {isSelecting && (
//                                     <button className='add-button' onClick={handleMergeClick}><MergeTypeIcon />Merge</button>
//                                 )}
//                                 {isUnmerging && (
//                                     <button className='add-button' onClick={handleUnmergeClick}><CallSplitIcon />Unmerge</button>
//                                 )}
//                                 {showFolderUndoAlert && (
//                                     <div className="undo-alert">
//                                         <span>Folder deleted. </span>
//                                         <button onClick={handleFolderUndo}>Undo</button>
//                                     </div>
//                                 )}



//                             </div>
//                             <div className='documents-div'>
//                                 <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                                     <button className="add-button" onClick={handleShowDocumentEditDelete}>
//                                         <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} /><span>Modify</span>
//                                     </button>
//                                     <button className='add-button' onClick={handleDocumentPopupOpen}>
//                                         <AddIcon /><span>Add Document</span>
//                                     </button>
//                                 </div>
//                                 <hr />

//                                 {isLoading ? (
//                                     <span className="loader"></span>
//                                 ) : documents.length > 0 ? (
//                                     documents.map((doc, index) => (
//                                         <div style={{ display: "flex", gap: "5px" }} key={index}>
//                                             <div className='index-box' style={{ padding: "12px" }}>{index + 1}</div>
//                                             <div className='document-item' style={{ flex: "1" }}>
//                                                 {doc.pdf && (
//                                                     <div className='flex-align'>
//                                                         <img src={pdf_img} alt="PDF" className="document-icon" />
//                                                         <a href={`${apiHost}${doc.pdf}`} target="_blank" rel="noopener noreferrer">
//                                                             {doc.file_name}
//                                                         </a>
//                                                     </div>
//                                                 )}
//                                                 {doc.video && (
//                                                     <div className='flex-align'>
//                                                         <img src={video_img} alt="Video" className="document-icon" />
//                                                         <a href={`${apiHost}${doc.video}`} target="_blank" rel="noopener noreferrer">
//                                                             {doc.file_name}
//                                                         </a>
//                                                     </div>
//                                                 )}
//                                                 {doc.link && (
//                                                     <div className='flex-align'>
//                                                         <img src={link_img} alt="Link" className="document-icon" />
//                                                         <a href={doc.link} target="_blank" rel="noopener noreferrer">
//                                                             {doc.link}
//                                                         </a>
//                                                     </div>
//                                                 )}
//                                                 {doc.general_doc && (
//                                                     <div className='flex-align'>
//                                                         <img src={general_doc_img} alt="General Document" className="document-icon" />
//                                                         <a href={`${apiHost}${doc.general_doc}`} target="_blank" rel="noopener noreferrer">
//                                                             {doc.file_name}
//                                                         </a>
//                                                     </div>
//                                                 )}
//                                                 <div style={{ display: "flex", gap: "5px" }}>
//                                                     <button
//                                                         className='add-button-document'
//                                                         onClick={() => handleMoveUp(doc.id, documents[index - 1]?.id, index, index - 1)}
//                                                         disabled={index === 0}
//                                                     >
//                                                         <KeyboardDoubleArrowUpIcon sx={{ color: "var(--text)" }} />
//                                                     </button>
//                                                     <button
//                                                         className='add-button-document'
//                                                         onClick={() => handleMoveDown(doc.id, documents[index + 1]?.id, index, index + 1)}
//                                                         disabled={index === documents.length - 1}
//                                                     >
//                                                         <KeyboardDoubleArrowDownIcon sx={{ color: "var(--text)" }} />
//                                                     </button>
//                                                     <div
//                                                         className="hover-edit-delete-documents"
//                                                         style={{ display: showDocumentEditDelete ? 'flex' : 'none' }}
//                                                     >
//                                                         <div
//                                                             className="delete-icon"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 handleDocumentDelete(doc.id);
//                                                             }}
//                                                         >
//                                                             <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="no-subjects-text" style={{ height: "80%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//                                         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0px" }}>
//                                             <img style={{ height: "120px" }} src={empty_folder} alt="No Folders" />
//                                             <p>Folder is Empty</p>
//                                             <button className='add-button' onClick={handleDocumentPopupOpen}>
//                                                 <AddIcon /><span>Add Document</span>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                                 {showDocUndoAlert && (
//                                     <div className="undo-alert">
//                                         <span>Document deleted. </span>
//                                         <button onClick={handleDocUndo}>Undo</button>
//                                     </div>
//                                 )}
//                             </div>

//                             <Dialog open={showSharePopup} onClose={handleShareClose}>
//                                 <DialogTitle>Share Document</DialogTitle>
//                                 <DialogContent>
//                                     <TextField
//                                         label="Recipient Email"
//                                         type="email"
//                                         fullWidth
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                     />
//                                 </DialogContent>
//                                 <DialogActions>
//                                     <Button onClick={handleShareClose}>Cancel</Button>
//                                     <Button onClick={handleShareSubmit}>Share</Button>
//                                 </DialogActions>
//                             </Dialog>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default LvlComponent
