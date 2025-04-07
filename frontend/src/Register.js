import { useNavigate } from "react-router-dom"; 
export default function Register(){  
    function handleRegister(){
      
    } 
    const navigate = useNavigate(); 
    return(
        <form onSubmit={handleRegister()} className="authform"> 
          <div className="myFormGroup">
            <label htmlFor="name">Name As Per IC: </label> 
            <input type="text"/> 
          </div> 
          <div className="myFormGroup">
            <label htmlFor="icNumber">IC Number: </label> 
            <input type="text" pattern="^(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))-\d{2}-\d{4}$" 
            name="icNumber" 
            placeholder="E.g 040804-08-0533"
            /> 
          </div> 
          <div className="myFormGroup"> 
            <label htmlFor="password">Password: </label> 
            <input type="password"/> 
          </div>  
          <br/>
          <button type="submit">Register</button>
          <button onClick={()=>{navigate('/')}}>Back To Login</button>
        </form>
    )
}