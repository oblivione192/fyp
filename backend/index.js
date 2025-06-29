import app from "./express.js";  
import userRouter from "./api/v1/auth.js";  
import appointmentRouter from "./api/v1/appointments.js"; 
import clinicRouter from "./api/v1/clinic.js"; 
import hrRouter from "./api/v1/healthRecord.js"; 
import profileRouter from "./api/v1/profile.js";
import jwt from 'jsonwebtoken';
import path from 'path';  
import medRouter from "./api/v1/medications.js"; 
import adminRouter from "./api/v1/admin.js"; 
import cookieParser from "cookie-parser";
const PORT = 3000;   
const validRoutes = new Set(); 
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use((req, res, next) => {
  console.log(req.path);

  if (
    req.path !== "/" && 
    !req.path.match("/auth/*") &&
    validRoutes.has(req.path)
  ) {
    const authHeader = req.headers.authorization; 
    console.log(authHeader);
    if (!authHeader) {
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Bearer");
      err.status = 401;
      return next(err);
    }


    const token = authHeader.split(" ")[1].trim();

    jwt.verify(token, process.env.COOKIE_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({ status: "failure", message: "Wrong or invalid token" });
      }

      const userId = decoded.user_id?.user_id;

      req.user_id = userId; 

      console.log("Decoded:", decoded);  
      console.log(req.user_id); 
      next(); // ✅ Now correctly waits until token is verified
    });
  } else {
    next(); // For login/register paths
  }
}); 

app.use((req, res, next) => {
    const requestedPath = req.path;
    console.log(req.path);
    // Check if the requested path exists in validRoutes (Set lookup is O(1))
    if (!validRoutes.has(requestedPath)) {
      // If the path is invalid, serve index.html (usually for React/SPA apps)
      return res.sendFile(path.join(path.resolve(), 'build', 'index.html')); 
    }
    
    // If the path is valid, continue with the request
    next();
});
  

app.use('/auth/user',userRouter);  
app.use('/api/appointment',appointmentRouter);   
app.use('/api/clinic',clinicRouter); 
app.use('/api/health',hrRouter); 
app.use('/api/profile',profileRouter); 
app.use('/api/medication',medRouter);  
app.use('/auth/admin',adminRouter);  

userRouter.stack.forEach((layer)=>{ 
  const prefix = "/auth/user"; 
  if(layer.route){
    validRoutes.add(prefix + layer.route.path); 
  }
})
appointmentRouter.stack.forEach((layer)=>{
  const prefix = "/api/appointment"; 
  if(layer.route){
   validRoutes.add(prefix +  layer.route.path); 
  }
})
clinicRouter.stack.forEach((layer)=>{
  const prefix = "/api/clinic";
  if(layer.route){
    validRoutes.add(prefix  + layer.route.path); 
  }
}) 
profileRouter.stack.forEach((layer)=>{
   const prefix = "/api/profile"; 
   if(layer.route){
      validRoutes.add(prefix + layer.route.path); 
   }
})
hrRouter.stack.forEach((layer)=>{
  const prefix = "/api/health"; 
  if(layer.route){
    validRoutes.add(prefix + layer.route.path); 
  }
})
medRouter.stack.forEach((layer)=>{
   const prefix = "/api/medication"; 
   if(layer.route){
    validRoutes.add(prefix + layer.route.path); 
   }
}) 
adminRouter.stack.forEach((layer)=>{
   const prefix = "/auth/admin"; 
   if(layer.route){
     validRoutes.add(prefix +  layer.route.path); 
   }
})
console.log([...validRoutes]);  

app.listen(PORT, ()=>{
    console.log(`Express server running at http://localhost:${PORT}/`)
})  



  