import {createSlice} from '@reduxjs/toolkit';

const initialState=  
{   
    healthRecord:{
        blood_type: "", 
        diagnosis: "",
        notes: "", 
        recorded_at:null,
        height: 0, 
        weight: 0, 
        bmi: 0,  
   },
    haveExistingRecord: false,
    init: false
}  

const hrReducer = 
createSlice(
{  
     name: 'Health', 
     initialState, 
     reducers:{
         initHealthRecord:function(state,action){  
            Object.assign(state.healthRecord,{...initialState.healthRecord,...action.payload});
            state.haveExistingRecord = Boolean(Object.entries(action.payload).length); 
            state.init= true; 
         } ,
         updateHealthRecord:function(state,action){
            Object.assign(state.healthRecord,{...state.healthRecord,...action.payload}); 
            if(!state.haveExistingRecord){
                 state.haveExistingRecord =  true; 
            }
         },
         clear:function(state){
             Object.assign(state, initialState);  
             state.haveExistingRecord = false; 
         } 
     }
} 
) 

export default hrReducer.reducer;   
export const {initHealthRecord,updateHealthRecord,clear} = hrReducer.actions; 


