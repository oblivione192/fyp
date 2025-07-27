import API from "../controllers";
import { useSelector } from "react-redux"; 
export default function useProfile(){  
    const hasInit = useSelector(state => state.Profile.init);  

    const getProfile = async(userRole)=>{ 
      if(!hasInit){
        const ProfileController = API.getController('profile'); 
        const profile = await ProfileController.getProfile(userRole); 
        return profile;  
      } 
    } 

    return getProfile
}