import React from 'react';
import { Card, Button } from 'antd';

function Post(props) {
    const parseDate = createdAt => {
        if (createdAt === undefined) {
            return "";
        }
        else {
            let meridiem = Number(createdAt.getHours()) / 12 < 1 ? "AM" : "PM";
            let hour = Number(createdAt.getHours()) % 12;
            if (hour === 0) hour = 12;
            let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(createdAt.getMonth())];
            return `${hour}:${createdAt.getMinutes()} ${meridiem} • ${month} ${createdAt.getDate()}, ${createdAt.getFullYear()}`;
        }
    }

    return (
        <Card className="SubscriptionContent" style={{
            padding: "0px",
            minHeight: "100px"
        }}>
            <div style={{
                display: "grid",
                gridTemplateRows: "auto auto 50px"
            }}>
                <div style={{
                    margin: "20px", 
                    border: "0px",
                    fontSize: "20px"
                }}>
                    {props.content}
                </div>
                <hr style={{margin: "0"}} />
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px",
                    alignItems: "center"
                }}>
                    <div style={{
                        color: "grey",
                        marginLeft: "14px"
                    }}>
                        {parseDate(props.createdAt)}
                    </div>
                    <div>
                        {props.deleteContent === undefined ?
                        <div>
                        </div>
                        :
                        <Button className="cancel-button" style={{

                        }} onClick={() => {
                            props.deleteContent(props.contentKey);
                        }}>
                            Delete
                        </Button>
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default Post;
