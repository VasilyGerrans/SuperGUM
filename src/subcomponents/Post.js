import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';

function Post(props) {
    const [ image, setImage ] = useState(undefined);
    const [ audio, setAudio ] = useState(undefined);
    const [ video, setVideo ] = useState(undefined);

    useEffect(() => {
        if (props.attributes.IPFS !== undefined) {
            (async () => {
                await fetch(props.attributes.IPFS)
                .then(response => response.blob())
                .then(imageBlob => {
                    const localUrl = URL.createObjectURL(imageBlob);
                    console.log(imageBlob);
                    if (imageBlob.type.startsWith("image")) {
                        setImage(localUrl);
                    } else if (imageBlob.type.startsWith("audio")) {
                        setAudio(localUrl);
                    }
                    else if (imageBlob.type.startsWith("video")) {
                        setVideo(localUrl);
                    }
                });
            })();
        }
    }, [props.attributes]);

    useEffect(() => {
        console.log("A", audio, "B", image);
    }, [audio, image]);

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
                    {image !== undefined ? 
                    <a href={props.attributes.IPFS} target="_blank" rel="noreferrer">
                        <img height="200" src={image} alt="post" /> 
                    </a>
                    :
                    audio !== undefined ?
                    <audio controls>
                        <source src={audio} type="audio/mpeg"/>
                        Audio not supported.
                    </audio>
                    : 
                    video !== undefined ?
                    <video height="240" controls>
                        <source src={video} type="video/mp4" />
                    </video>
                    :
                    <span>
                        {props.content.attributes.content} 
                    </span>
                    }
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
