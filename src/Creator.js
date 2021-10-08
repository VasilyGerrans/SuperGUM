import React, { useEffect, useState } from 'react';
import { useMoralisQuery } from 'react-moralis';
import ConnectViaMetaMask from './subcomponents/ConnectViaMetaMask';
import Post from './subcomponents/Post';
import NothingYetGo from './subcomponents/NothingYetGo';
import CreatedOther from './subcomponents/CreatedOther';
import { tokens, calculateStream } from './config';
import { Card } from 'antd';
import { Spinner } from 'react-bootstrap';

function Creator(props) {
    const [ pageAddress, setPageAddress ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ bio, setBio ] = useState("");
    const [ flowInfo, setFlowInfo ] = useState({});
    const [ minSubscription, setMinSubscription ] = useState(0);
    const [ currentSubscription, setCurrentSubscription ] = useState(0);
    const [ contentUnlocked, setContentUnlocked ] = useState(false);
    const [ pageContent, setPageContent ] = useState([]);
    const [ pageLoading, setPageLoading ] = useState(true);

    const { data } = useMoralisQuery("Pages", query => { 
        if (props.web3.utils.isAddress(pageAddress) === true) {
            return query.equalTo("ethAddress", props.web3.utils.toChecksumAddress(pageAddress)); 
        }
    }, [pageAddress]);

    const { data: content } = useMoralisQuery("Content", query => {
        if (props.web3.utils.isAddress(pageAddress) === true) {
            return query.equalTo("ethAddress", props.web3.utils.toChecksumAddress(pageAddress)).descending("createdAt");
        }
    }, [pageAddress]);

    useEffect(() => {
        if (props.web3.utils.isAddress(window.location.pathname.slice(1))) {
            setPageAddress(props.web3.utils.toChecksumAddress(window.location.pathname.slice(1)));
        }
        else {
            props.history.push("/"); 
        }
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
        if (pageLoading === true && props.web3.utils.isAddress(pageAddress)) {
            setPageLoading(false);
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

    useEffect(() => {
        setPageContent(content);
    }, [content]);

    const getFlow = async () => {
        await props.sf.cfa.getFlow({
            superToken: tokens.rinkeby.fDAIx,
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
          token: tokens.rinkeby.fDAIx
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
        .catch(e => {
            console.error(e);
          (async () => {
            await getFlow();
          })();
        })
    }

    return (
        <div>
            <Card className="CreatorContent" bordered={true}>
                {pageLoading === true ?
                <Spinner animation="border" role="status">
                </Spinner>
                :
                props.connected === false ?
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
                    minSubscription={minSubscription}
                    flowInfo={flowInfo}
                    username={username}
                    bio={bio}
                />
                }
            </Card>
            {username === "" || contentUnlocked === false ?
            <div></div>
            :
            <div>                
                {pageContent.map(c => { 
                    return (
                    <Post 
                        key={c.id} 
                        contentKey={c.id} 
                        content={c} 
                        attributes={c.attributes}                        
                        createdAt={c.createdAt}
                    />)
                })}
            </div>
            }
        </div>
    )
}

export default Creator;
