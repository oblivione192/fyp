import API from "../controllers"; 
import { useEffect, useState } from "react"; 
import Loading from "./Loading";  
import {FormSelect} from "react-bootstrap";
import { ListGroup,ListGroupItem } from "react-bootstrap";
import { formatDate, showFormattedTime} from "../util/Time"; 

export default function SlotStep({ appointmentRef, onSelectSlot }) {
  const [slots, setSlots] = useState(null);
  const [showDate, setShowDate] = useState(null);  

  useEffect(() => {
    API.getController("Appointment").getUpcomingSlots(appointmentRef.current.ClinicId)
      .then(slotList => {
        const grouped = slotList.reduce((acc, slot) => {
          const dateKey = new Date(slot.slotDate).toISOString().split("T")[0];
          acc[dateKey] = acc[dateKey] || [];
          acc[dateKey].push(slot);
          return acc;
        }, {});
        setSlots(grouped);
      })
     
  }, []);

  if (!slots) return <Loading />;

  return (
    <div style={{ overflowY: "scroll", maxHeight: "24rem" }}> 
      <div style={{display:'flex'}}>
            <p>Select a Date</p>
            <FormSelect 
            style={{
              height: '2.5rem'
            }}
            onChange={(event)=>{
                setShowDate(event.target.value); 
            }}> 
              <option>--</option>
              {
              
                Object.entries(slots).map((slot)=>{
                    return(
                      <option value={slot[0]} key={slot[0]}>
                        {formatDate(slot[0])}
                      </option>
                    )
                })
              }
            </FormSelect>
      </div>
         <ListGroup>
      {showDate && (
  <div>
    <p>Available Slots</p>
        <ListGroup>
              {slots[showDate].map((slot) => {
                const slotStartTime = showFormattedTime(
                  new Date(`${showDate}T${slot.startTime}`).getTime()
                );
                const slotEndTime = showFormattedTime(
                  new Date(`${showDate}T${slot.endTime}`).getTime()
                );

                return (
                  <ListGroupItem 
                    className="slot"
                    key={slot.SlotId}
                    onClick={(event) => {
                      appointmentRef.current.SlotId = slot.SlotId;
                      appointmentRef.current.date = new Date(slot.slotDate)
                        .toISOString()
                        .split("T")[0];
                      appointmentRef.current.startTime = slot.startTime;
                      appointmentRef.current.endTime = slot.endTime;
                      onSelectSlot();
                    }}
                  >
                    {slotStartTime} - {slotEndTime}
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </div>
        )}
      
         </ListGroup> 
    </div>
  );
}
