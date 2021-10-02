import { Button } from 'antd';
import React from 'react';
import EmptyBox from '../images/emptybox.png';
import { PAGES } from '../config';

function NothingYetCreate(props) {
    return (
        <div>
            <h1><b>There is no page here yet</b></h1>
            <p className="account-highlight">{props.address}</p>
            <p>
                <img src={EmptyBox} alt="" height="200" />
            </p>
            <Button onClick={() => {
                props.setCurrentPage(PAGES.USER);
            }}>
                Create
            </Button>
        </div>
    )
}

export default NothingYetCreate;
