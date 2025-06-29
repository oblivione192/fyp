import bcrypt  from "bcryptjs";
 
 bcrypt.compare('123abc','$2b$12$2a4oLRTTalOAsftamVu7fukmwO4I7LPMnVYunMkf/vqU4Od9q8a1y')
 .then((result)=>{
    console.log(result); 
 })