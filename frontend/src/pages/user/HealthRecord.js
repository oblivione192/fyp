import InformationCard from "../../components/InformationCard"; 
import { Button, Card } from "react-bootstrap";  
import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io"; 
import {useNavigate} from 'react-router-dom';
import { useState } from "react"; 
import { FaClipboard, FaHeartbeat } from "react-icons/fa";
import OptionBox from "../../components/OptionBox.jsx";  
import React from "react";
import { initHealthRecord, updateHealthRecord,clear } from "../../reducers/healthRecordReducer.js"; 
import {useSelector,useDispatch} from 'react-redux'; 
import API from "../../controllers/index.js";
import { Form,FormControl, FormGroup, FormLabel} from "react-bootstrap";  
import useWindowSize from "../../hooks/useWindowSize.js";

function HealthDisplay(){
  
    const healthRecord = useSelector(state=>state.Health.healthRecord);   
    const profile = useSelector(state=>state.Profile.profile);  
    const isInit = useSelector(state=>state.Health.init);  
    const haveExistingRecord = useSelector(state=>state.Health.haveExistingRecord)
    const dispatch = useDispatch();  
    
    const accessorToHeaders  = { 
      RecordId:2, 
      PatientId:1,
      blood_type:"Blood Type",
      diagnosis:"Diagnosis",
      notes:"Notes",
      height:"Height",
      weight:"Weight",
      bmi:"BMI"
    } 

    useEffect(()=>{  
      console.log(isInit); 
      if(!isInit){
          API.getController('health').getHealthRecord()
          .then((result)=>{
                  dispatch(
                     initHealthRecord(result)
                  )
          }
       ) 
       .catch((err)=>{
           console.log(err); 
       })
      }
      
    },[dispatch,isInit]) 
    console.log(Object.entries(healthRecord));
    return(
      <div id="healthDisplay">
         <InformationCard>
            <Card.Title>Your Health Record</Card.Title>
            <Card.Subtitle
              style={
                {
                  fontStyle:'italic',
                  color:'grey'
                }
              }
            >{isInit !==false && haveExistingRecord  ? "As of " + healthRecord.recorded_at.split("T")[0] : ''} 
            </Card.Subtitle> 
            <Card.Body>
               {
                 healthRecord!==null ? 
                 <div id="healthRecord">
                  <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "20rem" }}>
                    <tbody>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{profile.fname + " " + profile.mname + " " + profile.lname}</td>
                      </tr>
                      <tr>
                        <td><strong>Age:</strong></td>
                        <td>{profile.age}</td>
                      </tr>
                      {
                        Object.entries(healthRecord)
                          .filter(([key]) => key !== 'recorded_at' && key !== 'PatientId' && key !== 'RecordId')
                          .map(([key, value]) => (
                            <tr key={key}>
                              <td><strong>{accessorToHeaders[key]}:</strong></td>
                              <td>{value}</td>
                            </tr>
                          ))
                      }
                    </tbody>
                  </table>
                </div> :  

                 <p>Loading</p>
               }
            </Card.Body>
         </InformationCard>
      </div>
    )
} 
function HealthForm(){
    const healthRecord = useSelector(state => state.Health.healthRecord);   
    const hasExistingRecords = useSelector(state=>state.Health.haveExistingRecord);  
    const dispatch = useDispatch();   
    const [changes, setChanges] = useState({});  
    

        
    const submitHealthRecord = function(event){  
        event.preventDefault(); 
        const formData = new FormData(event.target); 
        const formJson = Object.fromEntries(formData);  
        API.getController('health').addHealthRecord(formJson)
        .then((result)=>{
           if(result.status==="Success"){
              dispatch(updateHealthRecord(formJson)); 
           }
        })
    } 

    const updateRecord = function(event){
       event.preventDefault(); 
       API.getController('health').updateHealthRecord(changes)
       .then((result)=>{
         if(result.status === "Success"){
            dispatch(updateHealthRecord(changes)) 
         }
       })
    }
     return( 
      <div>  
        
          <InformationCard>
            <Card.Title>Health Record Form</Card.Title>
            <Form style={{borderStyle:"groove", padding:"4px"}} 
               onSubmit={hasExistingRecords ? updateRecord : submitHealthRecord}
            > 
                <FormGroup> 
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl
                            type="number"
                            name="height"
                            placeholder="Height in cm" 
                            defaultValue={
                              hasExistingRecords ? 
                              healthRecord.height : ''
                            }
                            onChange={(event)=>{
                               if(hasExistingRecords){
                                   setChanges({...changes,height:event.target.value})
                               }
                            }}
                        />  
                </FormGroup>   
                <FormGroup>
                    <FormLabel>Weight (kg)</FormLabel> 
                    <FormControl 
                       type="number"  
                       name="weight"
                       placeholder="Weight in kg" 
                       defaultValue={
                         hasExistingRecords ? 
                         healthRecord.weight : ''
                       } 
                       onChange={(event)=>{
                         if(hasExistingRecords){
                            setChanges({...changes,weight:event.target.value})
                         }
                       }}
                       /> 
                </FormGroup> 
                <FormGroup>
                     <FormLabel>Bloodtype </FormLabel> 
                     <Form.Select  
                     name="blood_type"
                     defaultValue={
                      hasExistingRecords ? 
                      healthRecord.blood_type : 'A'  
                     }
                      onChange={(event)=>{
                         if(hasExistingRecords){
                            setChanges({...changes,blood_type:event.target.value}); 
                         }
                      }}
                     >
                        <option>A</option>
                        <option>A+</option> 
                        <option>A-</option> 
                        <option>B</option> 
                        <option>B+</option>
                        <option>B-</option>
                        <option>O</option> 
                        <option>O+</option> 
                        <option>O-</option> 
                        <option>AB</option> 
                        <option>AB+</option> 
                        <option>AB-</option>
                     </Form.Select>
                </FormGroup>
                <Button type="submit">{hasExistingRecords ? "Update" : "Submit" }</Button>
            </Form> 
            <Form style={{borderStyle:"groove", padding:"4px"}}>
                   <FormGroup>
                     <FormLabel>Medical History </FormLabel> 
                     <Form.Select>
                       
                     </Form.Select>
                     
                </FormGroup>
            </Form>
          </InformationCard>
       
      </div>
        
     )
}
export default function HealthRecord(){   
    const navigate = useNavigate();  
    const [tab,setTab] = useState('Display');  
    const width = useWindowSize();
    let boxWidth = "30%";
    let boxHeight = "120px";
    if (width < 768) {
          boxWidth = "80%";
          boxHeight = "80px";
    } else if (width < 1200) {
          boxWidth = "45%";
          boxHeight = "100px";
    }
    return( 
      <>   
           
          <IoMdArrowBack
            style={{color:"white",width:"54px",height:"54px"}} 
            onClick={()=>{navigate('/home')}}
          /> 
          <span style={{fontSize:"24px"}}>Back</span> 
          <div 
            id="healthInfoWrapper"
          >


            <div className="actionBar"
              style={{justifyContent:'center'}} 
              > 
                <OptionBox 
                  style={{
                    backgroundColor:"red",
                    color:"white",
                    width: boxWidth,
                    height:boxHeight,
                    fontSize:width*0.05 ,
                    padding: '1.5px'
                  }} 
                onClick={()=>{setTab('Display')}}
                IconComponent={FaHeartbeat} 
                text="View Health Info"
                />
              <OptionBox   
                
                style={{
                  backgroundColor: "green",
                  color:"white",
                  width:boxWidth,
                  height:boxHeight,
                  fontSize:width*0.05,
                   padding: '1.5px'
                }} 
                onClick={()=>{setTab('Form')}}
                IconComponent={FaClipboard}
                text="Health Record Form"  
             
              /> 
          
          </div> 
          {
            tab === 'Display' ? 
            <HealthDisplay/> : 
            <HealthForm/>
          }
          </div>
          
      </>
    
    )
}