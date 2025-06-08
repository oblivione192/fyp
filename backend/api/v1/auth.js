import express from 'express'; 
import UserDao from '../../dao/UserDao.js'; 
import jwt from 'jsonwebtoken'; 



const usersDao = UserDao.getPatientDao(); 
const userRouter = express.Router();  
userRouter.post('/checkTokenExpiry',async function(req,res){
   console.log(req.body); 
   jwt.verify(req.body.token,"fyp2025",function(err,decoded){
     if(err){ 
        return res.status(404).send({status:"expired"})
     }
     return res.status(200).send({status:"Valid"}); 
   })
})
userRouter.post('/login',async function(req,res){  
  console.log("Executing from login");
  const icnumber = req.body?.icNumber;    
  const password = req.body?.password;    
  const rememberMe = req.body?.rememberMe; 
  const statusCode = await usersDao.validateCredentials(icnumber,password ); 
  
  console.log(statusCode);
  if(statusCode == 2){ 
    const user_id = await usersDao.getUserId(icnumber); 
    if(rememberMe){jwt.sign({user_id:user_id},'fyp2025',{expiresIn: 86400*365.25})}
    const token = jwt.sign({user_id:user_id},'fyp2025')
    res.send({success:true,token:token});    
  } 
  else{ 
    console.log("Wrong username"); 
    res.send({success:false,message: statusCode == 0 ? "No such user." : "Wrong password"}); 
  }
}) 

userRouter.post('/register',async function(req,res){ 
  const fname =  req.body?.fname; 
  const mname= req.body?.mname; 
  const lname = req.body?.lname; 
  const icNumber = req.body?.icnumber;  
  const password = req.body?.password;  
  const email = req.body?.email  

  //Data processing 

  const [birth, , serial] = icNumber.split("-");
  const year = parseInt(birth.slice(0, 2), 10);
  const month = birth.slice(2, 4);
  const day = birth.slice(4, 6);

  // Decide century
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year > currentYear ? 1900 + year : 2000 + year;

  const birthDate = `${fullYear}-${month}-${day}`;

  const genderDigit = parseInt(serial.slice(-1));
  const gender = genderDigit % 2 === 0 ? "female" : "male";
  
  const userData = 
  {
    fname : fname, 
    mname: mname,
    lname : lname, 
    icnumber: icNumber, 
    email: email, 
    birthDate: birthDate, 
    gender: gender,
    joinDate: new Date(Date.now()).toISOString().slice(0, 19).replace("T", " ")
  } 


  console.log(req.body);
  console.log("Register being processed"); 
  try{
     const status = await usersDao.createUser(icNumber,password,userData); 
     status == 2?  console.log("User created") : console.log("Failed");  
     console.log("Status : ",status);
     switch(status){
      case 2: 
         res.send({success:true});
         break; 
      case 3:
         res.send({success:false,message:"User Already Exists"}); 
         break; 
      default: 
         res.send({success:false,message:"Status invalid" });
     }
  }
  catch{
    res.send({success:false,message:"Server error"}); 
  }
})   


export default userRouter;