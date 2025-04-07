
import { useNavigate } from "react-router-dom";  
export default function Login(){  
   const navigate = useNavigate(); 
    function handleLogin(event){ 
        event.preventDefault(); 
        //loginHandler 
        const formData= new FormData(event.target);  
        console.log("Login data received")
        const data= Object.fromEntries(formData.entries()); 
        console.log(data);
        if(data.icNumber==='040804-08-0533' && data.password==='123abc'){ 
           console.log("Credentials matched");
           navigate('/home'); 
        }
    } 
 
    return(
        <form onSubmit={handleLogin} className="authform">  
          <div className="myFormGroup">
            <label htmlFor="icNumber">IC Number: </label> 
            <input type="text" pattern="^(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))-\d{2}-\d{4}$" 
            name="icNumber" 
            placeholder="E.g 040804-08-0533"
            /> 
          </div> 
          <div className="myFormGroup"> 
            <label htmlFor="password" >Password: </label> 
            <input type="password" name="password"/> 
          </div>  
          <br/> 
          <div className="myFormGroup">
             <button type="submit">Login</button> 
             <button  type="button"  onClick={(event)=>{navigate('/register')}}>Register A New Account</button>
          </div>
          
        </form>
    )
}