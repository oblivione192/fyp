import 'bootstrap/dist/css/bootstrap.min.css'; 
import {Form,FormGroup,FormControl,Container} from 'react-bootstrap';  
import {Button} from 'react-bootstrap';
import { useLogin } from '../../hooks/useLogin';
import { useState } from 'react';
export default function AdminLogin() { 
    const {login,error} = useLogin();    

    const [clinicNo, setClinicNo] = useState(''); 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');  
    const [rememberMe, setRememberMe] = useState(false);  


    const handleSubmit = (e)=>{ 
        e.preventDefault(); 
        login({clinicNo,username,password},rememberMe,"admin"); 
    }

    return( 
       <Container fluid="md" style={{padding:'8px'}}>
            <Form className="authform" onSubmit={handleSubmit}>
             <FormGroup> 
               <Form.Label>Clinic Registration</Form.Label> 
               <FormControl 
                  type="text"
                  placeholder="12003001"   
                  required
                   onChange={(e)=>{setClinicNo(e.target.value)}}
                  />
             </FormGroup>  
                <Form.Label>Username</Form.Label> 
                <FormControl 
                  type="text"
                  placeholder="John Doe"     
                  required
                  onChange={(e)=>{setUsername(e.target.value)}}
                  />
             <FormGroup> 
                 <Form.Label>Password</Form.Label>
                 <FormControl 
                    type="password"  
                    required
                    onChange={(e)=>{setPassword(e.target.value)}}
                  /> 
             </FormGroup>   
             <FormGroup> 
                <div className="horizontalSection"> 
                        <p>Remember Me</p> 
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/> 
                </div>
              
             </FormGroup> 
             <Button variant="primary" type="submit">Login</Button> 
               {error && (
                <div
                    style={{
                    color: "red",
                    marginTop: "1rem",
                    textAlign: "center",
                    fontWeight: "500",
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
                )}
         </Form>
       </Container>
       
    )
}