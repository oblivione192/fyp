import { Tabs, Tab, Card } from 'react-bootstrap';
import {useLocation,useNavigate} from 'react-router-dom'
import { useRef } from 'react';  
import { AiFillPieChart } from 'react-icons/ai';
import {LuCalendar} from 'react-icons/lu'
import useTime from '../../hooks/useTime';  
import { Fragment } from 'react';
function Subheading(){  
   const location =useLocation();  

   const subheading = { 
     home: 
     <Fragment>  
           Quick Dashboard 
          <AiFillPieChart 
            style={{color:'red',height:'24px',width:'24px'
            }}
          />
     </Fragment> ,
     patientAppointment: 
      <Fragment>  
            Patient Appointments
            <LuCalendar
              style={{color:'red',height:'24px',width:'24px'}}
            />
       </Fragment> 
   } 


   return(
        subheading[location.pathname.split('/')[1]]
   ) 

}
export default function AdminLayout() {

  const {todayDate, timeNow} = useTime();
  const navigate = useNavigate();  
  const location = useLocation(); 
  return ( 
   <>
    { 
    location.pathname.split('/')[1]!=='profile' &&  
    <Fragment>
    <Tabs 
      defaultActiveKey="home" 
      className="mb-3 justify-content-center fs-4 fs-6"   
      onSelect={(key)=>{navigate(`/${key}`)}}
      style={{
        backgroundColor:"white",
        color:'white'
      }}
    >  
      {
      [["home","Dashboard"],
       ["patientAppointment","Patient Appointments"], 
       ["slots","Slot Management"], 
       ["staff","Staff Directory"], 
       ["medications","Medication Prescription"]
      ].map((tab,index)=>{
         return(
          <Tab  eventKey={tab[0]} title={<p className="tabText">{tab[1]}</p>}
            key={index} 
          > 
          </Tab>
         )
      })
    
      }

    </Tabs>    
      <Card>
            <Card.Header style={{display:'flex',justifyContent:'center'}}>
                <p className="title">Admin Panel</p> 
            </Card.Header>  
            <Card.Header style={{display:'flex',justifyContent:'center' }}>
                 <strong>Time now: {todayDate + " " +  timeNow }</strong>
            </Card.Header>  
              <Card.Header style={{display:'flex',gap:'2rem', justifyContent:'center',alignContent:'center'
                            }}>  
                                 <Subheading/>
              </Card.Header> 
      </Card>  
      </Fragment>
}  
    </> 
  
  );
}