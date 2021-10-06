import React, { useState, useEffect } from 'react';
import { useMoralisQuery } from 'react-moralis';
import { Spinner } from 'react-bootstrap';
import { Card, Button } from 'antd';
import ConnectViaMetaMask from './subcomponents/ConnectViaMetaMask';
import NothingYetCreate from './subcomponents/NothingYetCreate';
import CreatingUser from './subcomponents/CreatingUser';
import CreatedUser from './subcomponents/CreatedUser';
import EditPost from './subcomponents/EditPost';
import Post from './subcomponents/Post';

function Home(props) {
    const [ pageAddress, setPageAddress ] = useState("");
    const [ pageCreationMode, setPageCreationMode ] = useState(false);
    const [ username, setUsername ] = useState("");
    const [ bio, setBio ] = useState("");
    const [ minSubscription, setMinSubscription ] = useState(0);
    const [ contentCreationMode, setContentCreationMode ] = useState(false);
    const [ pageContent, setPageContent ] = useState([]);
    const [ pageLoading, setPageLoading ] = useState(true);

    const { data } = useMoralisQuery("Pages", query => { 
        if (props.web3.utils.isAddress(pageAddress) === true) {
            return query.equalTo("ethAddress", props.web3.utils.toChecksumAddress(pageAddress)); 
        }
    }, [pageAddress]);

    const { data: content } = useMoralisQuery("Content", query => {
        if (props.web3.utils.isAddress(pageAddress) === true) {
            return query.equalTo("ethAddress", props.web3.utils.toChecksumAddress(pageAddress));
        }
    }, [pageAddress]);

    useEffect(() => {
        if (props.web3.utils.isAddress(props.account)) {
            setPageAddress(props.web3.utils.toChecksumAddress(props.account));
        }
    }, []);

    useEffect(() => {
        setPageContent(content);
    }, [content]);

    useEffect(() => {
        if (props.web3.utils.isAddress(props.account)) {
            setPageAddress(props.web3.utils.toChecksumAddress(props.account));
        }
    }, [props.account]);

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

    const bioCharacterLimit = 300;
    const usernameCharacterLimit = 40;

    const createPage = async (username, ethAddress, bio, minSubscription) => {
        if (username !== undefined && 
            username.length > 0 &&
            username.length <= usernameCharacterLimit && 
            bio !== undefined &&
            bio.length <= bioCharacterLimit) {
            await modifyPage(username, ethAddress, bio, minSubscription)
            .then(() => {
                setUsername(username);
                setBio(bio);
                setMinSubscription(minSubscription);
            })
            .catch(e => {
                console.error(e);
            });
        } 
    }

    const modifyPage = async (username, ethAddress, bio, minSubscription) => {
        const query = new props.Moralis.Query("Pages");
        const result = await query.equalTo("ethAddress", ethAddress).first();
        
        if (result === undefined) {
            let Pages = props.Moralis.Object.extend("Pages");
            const newPage = new Pages();
            newPage.set("username", username);
            newPage.set("bio", bio);
            newPage.set("minSubscription", minSubscription);
            newPage.set("ethAddress", ethAddress);
            await newPage.save();
        }
        else {
            result.set("username", username);
            result.set("bio", bio);
            result.set("minSubscription", minSubscription);
            await result.save();
        }
    }

    const createContent = async (text) => {
        if (props.web3.utils.isAddress(pageAddress) && text.trim().length > 0) {
            await modifyContent(text, pageAddress)
            .then(createdContent => {
                setPageContent([createdContent, ...pageContent]);
            })
            .catch(e => {
                console.error(e);
            });
        }
    }

    const deleteContent = async objectId => {
        const query = new props.Moralis.Query("Content");
        const result = await query.equalTo("objectId", objectId).first();

        if (result !== undefined) {
            result.destroy().then(() => {
                const c = pageContent.filter(entry => entry.id !== objectId);
                setPageContent([...c]);
            }, error => {
                console.error(error);
            });
        }
    }

    const modifyContent = async (text, objectId = "") => {
        if (objectId.length === 0) {
            let ContentClass = props.Moralis.Object.extend("Content");
            const newContent = new ContentClass();
            newContent.set("ethAddress", pageAddress);
            newContent.set("content", text);
            await newContent.save();
            return newContent;
        }
        else {
            const query = new props.Moralis.Query("Content");
            const result = await query.equalTo("objectId", objectId).first();
            if (result === undefined) {
                let ContentClass = props.Moralis.Object.extend("Content");
                const newContent = new ContentClass();
                newContent.set("ethAddress", pageAddress);
                newContent.set("content", text);
                await newContent.save();
                return newContent;
            }
            else {
                result.set("content", text);
                await result.save();
                return result;
            }
        }
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
                username === "" &&
                pageCreationMode === false ?
                <NothingYetCreate 
                    address={pageAddress}
                    setPageCreationMode={setPageCreationMode}
                />
                :
                username === "" ?
                <CreatingUser
                    address={pageAddress}
                    setPageCreationMode={setPageCreationMode}
                    createPage={createPage}
                    usernameCharacterLimit={usernameCharacterLimit}
                    bioCharacterLimit={bioCharacterLimit}
                />
                :
                <CreatedUser 
                    address={pageAddress}
                    modifyPage={modifyPage}
                    username={username}
                    bio={bio}
                    minSubscription={minSubscription}
                    pageCreationMode={pageCreationMode}
                    setPageCreationMode={setPageCreationMode}
                    usernameCharacterLimit={usernameCharacterLimit}
                    bioCharacterLimit={bioCharacterLimit}
                />
                }
            </Card>
            {username === "" ?
            <div>
            </div>
            :
            contentCreationMode === false ?
            <Button onClick={() => {setContentCreationMode(true)}} style={{
                margin: "30px"
            }}>
                Create content
            </Button>
            :
            <EditPost
                setContentCreationMode={setContentCreationMode}
                createContent={createContent}
            />            
            }
            {pageContent.map(c => { 
                return (
                <Post 
                    key={c.id} 
                    contentKey={c.id} 
                    content={c.attributes.content} 
                    deleteContent={deleteContent} 
                    createdAt={c.createdAt}
                />)
            })}
        </div>
    )
}

export default Home;
