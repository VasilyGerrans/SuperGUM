import { Button } from 'antd';
import React from 'react';
import EmptyBox from '../images/emptybox.png';

function NothingYetCreate(props) {
    return (
        <div>
            <h1><b>There is no page here yet.</b></h1>
            <p className="account-highlight">{props.address}</p>
            <p>
                <img src={EmptyBox} alt="" height="200" />
            </p>
            <Button>
                Create
            </Button>
        </div>
    )
}

export default NothingYetCreate;
