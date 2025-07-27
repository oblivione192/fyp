import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import {Provider} from 'react-redux';  
import store from './reducers';
import App from './App';
import reportWebVitals from './reportWebVitals';  
import API from './controllers';
import Event from './listeners/onLogIn'; 


let currentAuthState = {
  isLoggedIn: store.getState().Auth.isLoggedIn,
  authToken: store.getState().Auth.authToken,
};

window.onbeforeunload = function(){ 
  if(!localStorage.getItem("token")){ 
      localStorage.clear(); 
  }
}  
Event.onLogIn((next)=>{

})
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
            document.body.style.backgroundColor="#bbf7ab";
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
      API.setHeaders({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${next.authToken}`,
      }); 
  
    } else { 
      console.log("Clearing headers"); 
      API.setHeaders(null); 
      localStorage.clear();
    }
  }
}); 




const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render( 
 <Provider store={store}> 
  
      <App/> 
    
 </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
