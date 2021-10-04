import React, { useState } from 'react';
import { Card, Button } from 'antd';

function Post(props) {
    const [ warningMsg, setWarningMsg ] = useState("");
    const [ dateCreated , setDateCreated ] = useState("19:52 • Oct 4, 2021");

    return (
        <Card className="SubscriptionContent" style={{
            padding: "0px",
            display: "grid",
            gridTemplateRows: "auto auto 10px",
            minHeight: "100px"
        }}>
            <div style={{
                margin: "0px", 
                padding: "30px 10px 10px",
                width: "100%",
                border: "0px",
            }}>
                {props.content}
            </div>
            <hr />
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                alignItems: "center"
            }}>
                <div style={{
                    color: "grey",
                    margin: "2px"
                }}>
                    {dateCreated}
                </div>
                <div>
                    <Button className="cancel-button" onClick={() => {
                        props.deleteContent(props.contentKey);
                    }}>
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default Post;
