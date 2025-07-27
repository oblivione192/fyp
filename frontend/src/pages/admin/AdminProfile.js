import { Card, Form, FormSelect } from "react-bootstrap";
import { updateProfile } from "../../reducers/profileReducer"; 
import API from "../../controllers"; 
import { useState } from "react";  
import InformationCard from "../../components/InformationCard"; 
import ProfileCard from "../../components/ProfileCard.jsx";
import { useSelector,useDispatch } from "react-redux";
export default function AdminProfile(){
    const profile = useSelector(state =>  state.Profile.profile);   
    const dispatch = useDispatch();   
    const handleUpdate = function(changes,userType){  
         API.getController('profile').updateProfile({...changes, userType:userType})
         .then((result)=>{ 
              if(result.status === "Success"){  
                 console.log("Dispatching profile update"); 
                 dispatch(updateProfile(changes))
              }
         }) 
         .catch((err)=>{
            console.log(err); 
         }) 
    } 

    const headers = 
    [ 
      
      {
        title:"Email",
        accessor:"email" 
      },
     
    ]

    if(!profile){
       return (  <p>Loading...</p> )
    }
    return(
        <InformationCard>   
         <div style={{overflowY:'auto',maxHeight:'40rem' }}>
           <ProfileCard
            userDetails={profile}  
            userType="admin"
            userName={profile.username}
            headers={headers}
            pictureDir={null}
            updateHandler={handleUpdate}
           />
          </div>
         
              
        </InformationCard>
    )
}
