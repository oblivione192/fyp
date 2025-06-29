import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import {Provider} from 'react-redux';  
import store from './reducers';
import App from './App';
import reportWebVitals from './reportWebVitals';  
import { AdminLogin } from './pages/admin';
import API from './controllers';
import { CgWindows } from 'react-icons/cg';

let currentAuthState = {
  isLoggedIn: store.getState().Auth.isLoggedIn,
  authToken: store.getState().Auth.authToken,
};

window.onbeforeunload = function(){ 
  if(!localStorage.getItem("token")){ 
      localStorage.clear(); 
  }
}
const unsubscribe = store.subscribe(() => {
  const previous = currentAuthState;
  const next = store.getState().Auth;
  if (
    previous.isLoggedIn !== next.isLoggedIn ||
    previous.authToken !== next.authToken
  ) { 
    console.log("Setting up APIs")
    currentAuthState = {
      isLoggedIn: next.isLoggedIn,
      authToken: next.authToken,
    };

    if (next.isLoggedIn && !API.getHeaders()) {
      API.setHeaders({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${next.authToken}`,
      });
    } else {
      API.setHeaders({}); 
      localStorage.clear();
      unsubscribe();
    }
  }
}); 




const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render( 
 <Provider store={store}> 
    <React.StrictMode> 
      <App/> 
    </React.StrictMode>
 </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
