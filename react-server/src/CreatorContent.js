import React, { useEffect } from 'react';
import { Card } from 'antd';
import { Spinner } from 'react-bootstrap';
import ExperimentalSuperfluid from './ExperimentalSuperfluid';
import ConnectViaMetaMask from './subcomponents/ConnectViaMetaMask';
import NothingYetCreate from './subcomponents/NothingYetCreate';
import NothingYetGo from './subcomponents/NothingYetGo';
import CreatedOther from './subcomponents/CreatedOther';
import CreatedUser from './subcomponents/CreatedUser';
import { PAGES } from './config';

function CreatorContent(props) {
    return (
        <div>
            {props.currentPage === PAGES.LOADING ? 
            <div style={{margin: "250px"}}>
                <Spinner animation="border" role="status">
                </Spinner>  
            </div>
            :
            <Card className="CreatorContent" bordered={true}>
                {props.currentPage === PAGES.CONNECT ?
                <ConnectViaMetaMask /> 
                :
                props.currentPage === PAGES.NOTHING_CREATE ?
                <NothingYetCreate 
                    address={props.address}
                /> 
                :
                props.currentPage === PAGES.NOTHING_GO ?
                <NothingYetGo 
                    address={props.address}
                />
                :
                props.currentPage === PAGES.OTHER ?
                <CreatedOther 
                    createStream={props.createStream} 
                    balance={props.balance} 
                    address={props.address} 
                    account={props.account}
                    currentSubscription={props.currentSubscription}
                    flowInfo={props.flowInfo}
                />
                :
                <CreatedUser
                    address={props.address}
                />                            
                }
                {/* <ExperimentalSuperfluid 
                    createStream={props.createStream} 
                    balance={props.balance} 
                    address={props.address} 
                    account={props.account}
                    currentSubscription={props.currentSubscription}
                    flowInfo={props.flowInfo}
                /> */}
            </Card>
            }
        </div>
    )
}

export default CreatorContent;
