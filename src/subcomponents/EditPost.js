import React, { useState } from 'react';
import { Card, Button } from 'antd';

function EditPost(props) {
    const [ text, setText ] = useState("");
    const [ warningMsg, setWarningMsg ] = useState("");
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ uploadingFile, setUploadingFile ] = useState(false);

    const onFileChange = e => {
        if (e.target.files.length > 0) {
            setText("");
            setUploadingFile(true);
            setSelectedFile(e.target.files[0]);
        }
        else {
            setSelectedFile(null);
            setUploadingFile(false);
        }
    }

    const gridTemplateRows = uploadingFile ? "0px 10px" : "auto 10px";

    return (
        <Card className="SubscriptionContent" style={{
            padding: "0px",
            display: "grid",
            gridTemplateRows: gridTemplateRows,
            minHeight: "46px"
        }}>
            {uploadingFile === true ? 
            <div></div>
            :
            <textarea 
                rows="4"
                style={{
                    margin: "0px", 
                    padding: "10px",
                    width: "100%",
                    minHeight: "120px"
                }}
                placeholder="Your valuable content..."
                value={text}
                onChange={e => {
                    if (warningMsg.length > 0 &&
                    e.target.value.trim() !== "") {
                        setWarningMsg("");
                    }
                    setText(e.target.value)
                }}
            >
            </textarea>
            }
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                alignItems: "center"
            }}>
                <div>
                    {warningMsg.length > 0 ?
                    <div className="warning-message" style={{margin: "0px 10px"}}>
                        {warningMsg}
                    </div>
                    :
                    <>
                    </>
                    }
                </div>
                <div>                    
                    <input type="file" id="selectedFile" style={{display: "none"}} 
                        onChange={onFileChange}
                    />
                        {selectedFile !== null && selectedFile.name ?
                        <span>
                            {selectedFile.name}
                        </span>    
                        :
                        <span>
                            No file chosen.
                        </span>    
                        } 
                    &nbsp;
                    <input 
                        type="button" 
                        value="Select file"
                        className="dapp-button"
                        onClick={() => {
                            document.getElementById("selectedFile").click()
                        }} 
                    />
                    <Button className="cancel-button" onClick={() => {
                        props.setContentCreationMode(false);
                    }}>
                        Cancel
                    </Button>
                    <Button className="confirm-button" onClick={() => {
                        if (text.trim() === "") {
                            setWarningMsg("Error: please enter some content before publishing.");
                            if (selectedFile === null) {
                                setWarningMsg("Error: please enter some content before publishing.");
                            }
                            else {
                                if (["image/png", "image/jpeg", "image/gif", "video/mp4", "audio/mpeg"].includes(selectedFile.type)) {
                                    if (selectedFile.size < 10485760) {
                                        console.log(selectedFile);
                                        props.uploadFile(selectedFile);
                                        props.setContentCreationMode(false);
                                    }
                                    else {
                                        setWarningMsg("Error: only files under 10MB allowed.");
                                    }
                                }
                                else {
                                    setWarningMsg("Error: the only supported formats are png, jpeg, gif, mp3 and mp4.");
                                }
                            }
                        }
                        else {
                            props.createContent(text.trim());
                            props.setContentCreationMode(false);
                        }
                    }}>
                        Publish
                    </Button>
                </div>
            </div>            
        </Card>
    )
}

export default EditPost;
