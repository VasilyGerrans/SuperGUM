import React, { useState } from 'react';
import { Card, Button } from 'antd';

function EditPost(props) {
    const [ text, setText ] = useState("");
    const [ warningMsg, setWarningMsg ] = useState("");

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
                    <Button className="cancel-button" onClick={() => {
                        props.setContentCreationMode(false);
                    }}>
                        Cancel
                    </Button>
                    <Button className="confirm-button" onClick={() => {
                        if (text.trim() === "" && warningMsg === "") {
                            setWarningMsg("Error: please enter some content before publishing.");
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
