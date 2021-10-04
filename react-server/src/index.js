import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MoralisProvider } from 'react-moralis';
import { moralisLoginData } from './config';

ReactDOM.render(
  <MoralisProvider 
    appId={moralisLoginData.gerrans.appId} 
    serverUrl={moralisLoginData.gerrans.serverUrl}
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </MoralisProvider>
  , document.getElementById('root')
);
