import { useSelector } from "react-redux";
import HomePage from "./pages/user/MainMenu"; 
export default function Home() {    
    const userRole =  useSelector(state => state.Auth.userRole) 
    console.log('userRole: ',userRole);
    if(userRole === 'user'){
         return <HomePage/> 
    } 
    else if(userRole === 'admin'){
         return (
             <div>
                 <p>Welcome to admin</p>
             </div>
         )
    }
}