import PatientProfile from "./pages/user/PatientProfile"; 
import AdminProfile from "./pages/admin/AdminProfile";
import { useSelector } from "react-redux";
export default function Profile(){ 
   const userRole = useSelector(state => state.Auth.userRole);    
   switch(userRole.toLowerCase()){
     case "user": 
        return <PatientProfile/>     
     case "admin":
         return <AdminProfile/>
     default: 
        break; 
   }
}