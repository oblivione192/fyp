import store from '../reducers/' 
let currentAuthState = {
  isLoggedIn: store.getState().Auth.isLoggedIn,
  authToken: store.getState().Auth.authToken,
};
const Event = {} 
Event.onLogIn = function(callback){
    store.subscribe(()=>{
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

            callback(next); 
    }
    }) 
}

export default Event