import { createSlice } from "@reduxjs/toolkit" 

const initialState= { 
    notificationList: [], 
    subscribed: false, 
    read: false 
}  

const notificationReducer = createSlice({
      name: "Notifications", 
      initialState, 
      reducers:{ 
           notifyUser: function(state,payload){ 
              state.notificationList.push(payload);  
              if(state.read){
                 state.read = false; 
              }
           }, 
           markAsRead: function(state){ 
              state.read =  true;  
           }
      }
})  

const {notifyUser, markAsRead} = notificationReducer.actions;   

export default notificationReducer.reducer;  
export {notifyUser, markAsRead } 

 
 
// export default notificationReducer.reducer;  

