import ListGroup from 'react-bootstrap/ListGroup';
import InformationCard from './InformationCard';
function ListDisplayer({data}) { 
  return (
    <ListGroup>
      {
        data.map((item,index)=>{ 
         return(
           <ListGroup.Item id={index}>
              <InformationCard id={index} title={item.title} text={item.text} imageSrc={item.imageSrc} buttonText={item.buttonText}/> 
           </ListGroup.Item>
         )
        })
      }
    </ListGroup>
  );
}

export default ListDisplayer;