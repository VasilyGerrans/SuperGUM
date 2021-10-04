import React, { useEffect, useState } from 'react';
import { useMoralisQuery } from 'react-moralis';
import SubscriptionContent from './SubscriptionContent';
import ConnectViaMetaMask from './subcomponents/ConnectViaMetaMask';
import NothingYetGo from './subcomponents/NothingYetGo';
import CreatedOther from './subcomponents/CreatedOther';
import { tokens, calculateStream } from './config';
import { Card } from 'antd';

function Creator(props) {
    const [ pageAddress, setPageAddress ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ bio, setBio ] = useState("");
    const [ flowInfo, setFlowInfo ] = useState({});
    const [ minSubscription, setMinSubscription ] = useState(0);
    const [ currentSubscription, setCurrentSubscription ] = useState(0);
    const [ contentUnlocked, setContentUnlocked ] = useState(false);

    const { data } = useMoralisQuery("Pages", query => { 
        if (props.web3.utils.isAddress(pageAddress) === true) {
            return query.equalTo("ethAddress", props.web3.utils.toChecksumAddress(pageAddress)); 
        }
    }, [pageAddress]);

    useEffect(() => {
        setPageAddress(props.web3.utils.toChecksumAddress(window.location.pathname.slice(1)));
    }, []);

    useEffect(() => {
        if (data !== undefined && data[0] !== undefined && data[0].attributes !== undefined) {
            setUsername(data[0].attributes.username);
            setBio(data[0].attributes.bio);
            setMinSubscription(data[0].attributes.minSubscription);
        }
        else {
            setUsername("");
            setBio("");
            setMinSubscription(0);
        }
    }, [data]);

    useEffect(() => {
        if (props.web3.utils.isAddress(props.account) && 
        props.web3.utils.isAddress(pageAddress)) {
            (async () => {
                await getFlow();
            })();
        }
    }, [props.account, pageAddress]);

    useEffect(() => {
        if (minSubscription === 0 ||
            currentSubscription >= minSubscription) {
            setContentUnlocked(true);
        }
        else {
            setContentUnlocked(false);
        }
    }, [minSubscription, currentSubscription]);

    const getFlow = async () => {
        await props.sf.cfa.getFlow({
            superToken: tokens.ropsten.fDAIx,
            sender: props.account,
            receiver: pageAddress
        })
        .then(result => {
            setFlowInfo(result);
            setCurrentSubscription(calculateStream(Number(result.flowRate)));
        })
        .catch(e => {
            console.error(e);
        })
    }

    const createStream = async streamAmount => {
        await props.sf.user({
          address: props.account,
          token: tokens.ropsten.fDAIx
        })
        .flow({
          recipient: pageAddress,
          flowRate: streamAmount.toString()
        })
        .then(() => {
          (async () => {
            await getFlow();
          })();
        })
        .catch(() => {
          (async () => {
            await getFlow();
          })();
        })
    }

    return (
        <div>
            <Card className="CreatorContent" bordered={true}>
                {props.connected === false ?
                <ConnectViaMetaMask />
                :
                username === "" ?
                <NothingYetGo 
                    address={pageAddress}
                    history={props.history}
                />
                :
                <CreatedOther 
                    createStream={createStream} 
                    address={pageAddress} 
                    currentSubscription={currentSubscription}
                    flowInfo={flowInfo}
                    username={username}
                    bio={bio}
                />
                }
            </Card>
            {contentUnlocked === true ?
            <SubscriptionContent 
            />
            :
            <></>
            }
        </div>
    )
}

export default Creator;
