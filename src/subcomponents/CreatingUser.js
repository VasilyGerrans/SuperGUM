import React, { useState } from 'react';
import { Button, Input } from 'antd';
import AutosizeInput from 'react-input-autosize';
import AddressDisplay from './AddressDisplay';

function CreatingUser(props) {
    const [ username, setUsername ] = useState("");
    const [ bio, setBio ] = useState("");
   
    const [ _username, _setUsername ] = useState("");
    
    const [ minSubscription, setMinSubscription ] = useState(0);

    const [ warningMsg, setWarningMsg ] = useState("");

    const reset = () => {
        setUsername("");
        _setUsername("");
        setBio("");
        setMinSubscription(0);
    }

    const onBioChange = e => {
        if (e.target.value.length <= props.bioCharacterLimit) {
            setBio(e.target.value);
        }
    }

    const onUsernameChange = e => {
        if (e.target.value.length <= props.usernameCharacterLimit) {
            setUsername(e.target.value);
        }
    }

    const onSubChange = e => {
        setMinSubscription(e.target.value);
    }

    return (
    <div className="CreatedUser">
        <div
            style={{
                "display": "flex", 
                "justifyContent": "space-between",
                "alignItems": "center"
            }}
        >
            <div
                style={{
                    position: "relative"
                }}
            >
                <h1>
                    <AutosizeInput
                        className="name-input"
                        type="text" 
                        placeholder={_username.length > 0 ? _username : "Username"} 
                        value={username} 
                        onChange={onUsernameChange}
                        inputStyle={{
                            fontWeight: "bold",
                            padding: "0px"
                        }}
                    />
                </h1>
                <span className="new-tooltip" style={{                            
                    left: "-160px",
                    top: "7px"
                }}>
                    {username.length} / {props.usernameCharacterLimit}
                </span>
            </div>                    
        </div>                   
        <AddressDisplay
            address={props.address}
        />
        <div className="bio-window">
            <div style={{
                position: "relative",
                width: "100%"
            }}>
                <textarea 
                    onChange={onBioChange} 
                    value={bio} 
                    rows="3"
                    style={{
                        margin: "0px", 
                        padding: "0px"
                    }}
                    placeholder="Bio"
                >
                </textarea>
                <span className="new-tooltip" style={{
                    left: "-160px",
                    top: "19px"
                }}>
                    {bio.length} / {props.bioCharacterLimit}
                </span>
            </div>                    
        </div>  
        <div>
            <hr />
            <div 
                className="CreatedUser" 
                style={{
                    "display": "flex", 
                    "justifyContent": "space-between",
                    "alignItems": "center",
                    "margin": "20px 0px"
                }}
            >
                <div>
                    Minimum subscription: 
                    <b> 
                        <Input 
                            value={minSubscription}
                            type="number"
                            onChange={onSubChange}
                            min={0}   
                            step={0.01}                             
                        >
                        </Input> DAIx/month
                    </b>
                </div>
                <div>
                </div>
            </div>
        </div>
        <br />
        <div style={{margin: "auto"}}>
            <Button className="confirm-button" onClick={() => {
                if (username === "") {
                    setWarningMsg("Error: You must specify a username to create a page.");
                }
                else if (username.length > props.usernameCharacterLimit) {
                    setWarningMsg(`Error: Username must be below ${props.usernameCharacterLimit} characters.`);
                }
                else if (bio.length > props.bioCharacterLimit) {
                    setWarningMsg(`Error: Bio must be below ${props.bioCharacterLimit} characters.`);
                }
                else {
                    (async () => props.createPage(username, props.address, bio, Number(minSubscription)))();
                    props.setPageCreationMode(false);
                }
            }}>
                Create
            </Button>
            <Button className="cancel-button" onClick={() => {
                props.setPageCreationMode(false);
                reset();
            }}>
                Cancel
            </Button>
        </div>
        {warningMsg.length > 0 ?
        <div className="warning-message">
            {warningMsg}
        </div>
        :
        <>
        </>
        }
    </div>
    )
}

export default CreatingUser;
