
import Card from 'react-bootstrap/Card';
import {Row,Col, Container } from 'react-bootstrap'; 
function InformationCard({children}) {
  return ( 
  <Container style={{padding: '3px'}}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="mb-3" style={{  color: 'black' }}>
            {children}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default InformationCard; 