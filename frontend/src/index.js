import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import {Provider} from 'react-redux';  
import store from './reducers'; 
import GlobalModals from './GlobalModals';
import App from './App';
import reportWebVitals from './reportWebVitals';  
import API from './controllers'; 
import { getUserLocation } from './reducers/locationReducer';

import { getMessaging } from 'firebase/messaging';
let currentAuthState = {
  isLoggedIn: store.getState().Auth.isLoggedIn,
  authToken: store.getState().Auth.authToken,
};

window.onbeforeunload = function(){ 
  if(!localStorage.getItem("token")){ 
      localStorage.clear(); 
  }
}  

store.subscribe(()=>{
  const previous = currentAuthState;
  const next = store.getState().Auth; 
  
  if (
    previous.isLoggedIn !== next.isLoggedIn 
  ) { 
    if (next.isLoggedIn){
       switch(next.userRole){
          case "user":  
            document.body.style.backgroundImage='none'; 
            document.body.style.backgroundColor="#8bbdefff";
            break;
          case "admin":  
             document.body.style.backgroundImage='none';
             document.body.style.backgroundColor="#e4ebe5";
             break; 
           default:
             break; 
       }
    }
  }
})  

//api set up on log in.

 store.subscribe(() => {
  const previous = currentAuthState;
  const next = store.getState().Auth; 

  if (
    previous.isLoggedIn !== next.isLoggedIn ||
    previous.authToken !== next.authToken
  ) { 
    currentAuthState = {
      isLoggedIn: next.isLoggedIn,
      authToken: next.authToken,
    };  
  
    if (next.isLoggedIn && !API.getHeaders()) { 
      console.log("Setting up API");     
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${next.authToken}`,
      }
      API.setHeaders(headers);  
     
    } else { 
      console.log("Clearing headers"); 
      API.setHeaders(null); 
      localStorage.clear();
    }
  }
}); 

store.dispatch(getUserLocation())

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch((err) => console.error("Service Worker registration failed:", err));
  });
}
else{
  console.log("Service worker not in navigator")
}

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(  
 
    <Provider store={store}>  
           <App/> 
           <GlobalModals/>
    </Provider>

 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
