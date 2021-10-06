import React, { useState } from 'react';
import { Card, Button } from 'antd';

function EditPost(props) {
    const [ text, setText ] = useState("");
    const [ warningMsg, setWarningMsg ] = useState("");
    const [ selectedFile, setSelectedFile ] = useState(null);

    const onFileChange = e => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
        else {
            setSelectedFile(null);
        }
    }

    return (
        <Card className="SubscriptionContent" style={{
            padding: "0px",
            display: "grid",
            gridTemplateRows: "auto 10px",
            minHeight: "100px"
        }}>
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
                            if (selectedFile === null) {
                                setWarningMsg("Error: please enter some content before publishing.");
                            }
                            else {
                                if (["image/png", "image/jpeg", "image/gif", "video/mp4", "audio/mpeg"].includes(selectedFile.type)) {
                                    if (selectedFile.size < 5242880) {
                                        console.log("READY TO SEND");
                                    }
                                    else {
                                        setWarningMsg("Error: only files under 5MB allowed.");
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
