import InformationCard from "../../components/InformationCard";
import OptionBox from "../../components/OptionBox";  
import { useEffect, useState } from "react";
import { Form,FormSelect } from "react-bootstrap"; 
import { CgProfile } from "react-icons/cg";  
import { IoMdArrowBack } from "react-icons/io";
import { Card } from "react-bootstrap";  
import {useSelector, useDispatch} from 'react-redux'; 
import { updateProfile} from "../../reducers/profileReducer";  
import API from "../../controllers";
export default function PatientProfile(){  
    const profile = useSelector(state =>  state.Profile.profile);   
    const dispatch = useDispatch(); 
    const [editMode, setEditMode] = useState(false); 
    const [changes, setChanges] = useState({});   
    const handleUpdate = function(){  
         API.getController('profile').updateProfile({...changes, userType:"User"})
         .then((result)=>{ 
              if(result.status === "Success"){  
                 console.log("Dispatching profile update"); 
                 dispatch(updateProfile(changes))
              }
         }) 
         .catch((err)=>{
            console.log(err); 
         }) 
         .finally(()=>{
              setEditMode(false);  
         })
    }
 

    if(!profile){
       return (  <p>Loading...</p> )
    }
    return(
        <InformationCard>  
         
        <Card style={{overflowY:'auto',maxHeight:'100%' }}>
           
           <div onClick={()=>window.history.back()}>
             <IoMdArrowBack/> 
             <span>Back</span> 
           </div>
             
            <Card.Title className="title">Personal Info</Card.Title>
            <div className="verticalSection"> 
                <CgProfile className="profileIcon"/>  
                <p>{profile.fname + " " +profile.mname + " "+profile.lname}</p>
            </div>
            <div className="horizontalSection"> 
                <p>Ic NO.</p> 
                <p>{profile.icnumber}</p>
            </div>  
            <div className="horizontalSection">
                <p>State</p> 
                <p>Perak</p>
            </div> 
            <div className="horizontalSection">
                <p>Address</p> 
                {
                     editMode ? 
                     <input type="text"
                       defaultValue={changes.address ? changes.address 
                        : profile.address ? profile.address : ''
                       }
                       onChange = {(e)=>{
                         setChanges({...changes,address:e.target.value})
                       }}
                     /> : 
                     <p>{profile.address ? profile.address : "N/A"}</p>
                }
             
            </div>  
            {
                editMode ?  
                
                  (<div style={{display:'flex', gap: '3px'}}>
                        <button onClick={handleUpdate}>Save</button>  
                        <button onClick={()=>{setEditMode(false)}}>Cancel</button>
                  </div>) :  

                  (<button onClick={()=>{setEditMode(true)}}>Update</button>)  
            }
          
          </Card>  

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

         
              
        </InformationCard>
    )
}