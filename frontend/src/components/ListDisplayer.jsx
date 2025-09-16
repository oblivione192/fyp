import ListGroup from 'react-bootstrap/ListGroup';
import InformationCard from './InformationCard';
function ListDisplayer({data,children}) { 
  return (
    <ListGroup style={{overflowY:'auto',maxHeight:'400px'}}>
      {
        data.map((item,index)=>{ 
         return(
           <ListGroup.Item id={index}>
              {children(item)}
           </ListGroup.Item>
         )
        })
      }
    </ListGroup>
  );
}

export default ListDisplayer;