import React, { useEffect, useState } from 'react';
import Etherscan from '../images/etherscan.png';

function AddressDisplay(props) {
    const [ justification, setJustification ] = useState("left");
    useEffect(() => {
        if (props.justifyCenter === true) {
            setJustification("center");
        }
        else {
            setJustification("left");
        }
    }, [props.justifyCenter]);

    return (
        <div style={{
            display: "flex",
            justifyContent: justification,
            alignItems: "center"
        }}>
            <p className="account-highlight" style={{margin: "0px"}}>
                {props.address}
            </p>
            &nbsp;
            <a href={"https://ropsten.etherscan.io/address/" + props.address} target="_blank">
                <img src={Etherscan} width="15px" height="15px"/>
            </a>
        </div>
    )
}

export default AddressDisplay;
