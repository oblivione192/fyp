import InformationCard from "../../components/InformationCard";
import OptionBox from "../../components/OptionBox";  
import { Form,FormSelect } from "react-bootstrap"; 
import { Card } from "react-bootstrap";  
import {useSelector, useDispatch} from 'react-redux'; 
import { updateProfile} from "../../reducers/profileReducer";  
import ProfileCard from "../../components/ProfileCard";  
import { useMemo } from "react";
import API from "../../controllers";
export default function PatientProfile(){   
     
    const profile = useSelector(state =>  state.Profile.profile);   
    const dispatch = useDispatch(); 
 
    const handleUpdate = function(changes, userType){  
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
        title:"IC Number",
        accessor:"icnumber"
      }, 
  
      {
        title:"Email",
        accessor:"email" 
      },
      {
        title:"Address",
        accessor:"address"
      }
    ]

    if(!profile){
       return (  <p>Loading...</p> )
    }
    return(
        <InformationCard>   
         <div style={{overflowY:'auto',maxHeight:'40rem' }}>
           <ProfileCard
            userDetails={profile}  
            userType="user"
            userName={profile.fname + " "+profile.mname+ " "+profile.lname}
            headers={headers}
            pictureDir={null}
            updateHandler={handleUpdate}
           />
          
            <Card>
              <Card.Title className="title">Ride Info</Card.Title> 
              <div className="horizontalSection">
                  <Form.Label>Wheelchair Needed?</Form.Label> 
                  <FormSelect> 
                      <option>--</option>
                      <option>Yes</option> 
                      <option>No</option>
                  </FormSelect>
              </div> 
              <div className="horizontalSection">
                  <Form.Label>Assistace Required?</Form.Label> 
                  <FormSelect>
                      <option>--</option> 
                      <option>Yes</option> 
                      <option>No</option>
                  </FormSelect>
              </div>
            </Card>
            <Card>
              <Card.Title className="title">Family Contacts</Card.Title> 
              <div className="horizontalSection">
                  <Form.Label>Add a Contact</Form.Label> 
                  <button style={{padding:'2px',borderRadius:'20px',width:'60px',height:'30px'}}>+</button>
              </div>
            </Card> 
          </div>
         
              
        </InformationCard>
    )
}