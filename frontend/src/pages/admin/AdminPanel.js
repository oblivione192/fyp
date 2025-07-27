
import { Button } from "react-bootstrap" 
import { Card } from "react-bootstrap" 
import { AiFillPieChart } from "react-icons/ai" 
import { useEffect } from "react" 
import { useDispatch } from "react-redux" 
import { initProfile } from "../../reducers/profileReducer"
import useTime from "../../hooks/useTime" 
import useProfile from "../../hooks/useProfile"
export default function AdminPanel(){ 
    const {todayDate, timeNow} = useTime(); 
    const getProfile = useProfile();    
    const dispatch = useDispatch(); 
    useEffect(()=>{
          getProfile('Admin').then((profile)=>{
              dispatch(initProfile({...profile}))
          }) 
          .catch((err)=>{
             console.error(err); 
          })
    })
    return( 
        <Card>
            <div>
                <Card.Body>
                     <div className="horizontalSection">
                        <p>Total Appointments Today</p> 
                        <p>27</p> 
                     </div> 
                     <div className="horizontalSection">
                        <p>Average patients per slot</p> 
                        <p>11</p>
                     </div>
                </Card.Body>
            </div>
         
        </Card>
     
    )
}