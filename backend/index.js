import app from "./express.js";  
import userRouter from "./api/v1/auth.js";  
import appointmentRouter from "./api/v1/appointments.js"; 
import clinicRouter from "./api/v1/clinic.js"; 
import hrRouter from "./api/v1/healthRecord.js"; 
import profileRouter from "./api/v1/profile.js"; 
import MVARouter from "./api/v1/ride.js";
import jwt from 'jsonwebtoken';
import path from 'path';  
import medRouter from "./api/v1/medications.js";  

import adminRouter from "./api/v1/admin.js"; 
import locationRouter from "./api/v1/location.js";
import cookieParser from "cookie-parser"; 
import {match,pathToRegexp} from 'path-to-regexp'
const PORT = 3000;   
const validRoutes = new Set();  
const routeRegex = []; 
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
      req.clinicId = decoded?.clinicId;  
      req.user_id = userId; 
      
      console.log("Decoded:", decoded); 
      console.log(req.clinicId);  
      console.log(req.user_id); 
      next(); // ✅ Now correctly waits until token is verified
    });
  } else {
    next(); // For login/register paths
  }
}); 

app.use((req, res, next) => {
  const requestedPath = req.path;
  console.log("Requested:", requestedPath);

    // 1. Optimistic Set lookup (O(1))
    if (validRoutes.has(requestedPath)) return next();

    // 2. Fallback to regex only if Set fails
    for (const regex of routeRegex) {
      if (regex.test(requestedPath)) return next();
    }

    // 3. Nothing matched
    return res.sendFile(path.join(path.resolve(), 'build', 'index.html'));
});
  

app.use('/auth/user',userRouter);  
app.use('/api/appointment',appointmentRouter);   
app.use('/api/clinic',clinicRouter); 
app.use('/api/health',hrRouter); 
app.use('/api/profile',profileRouter); 
app.use('/api/medication',medRouter);  
app.use('/api/location',locationRouter); 
app.use('/api/mva',MVARouter);  
app.use('/auth/admin',adminRouter);   


const routerPrefixes = [
  { router: userRouter, prefix: "/auth/user" },
  { router: appointmentRouter, prefix: "/api/appointment" },
  { router: clinicRouter, prefix: "/api/clinic" },
  { router: profileRouter, prefix: "/api/profile" },
  { router: hrRouter, prefix: "/api/health" },
  { router: medRouter, prefix: "/api/medication" },
  { router: adminRouter, prefix: "/auth/admin" },
  { router: locationRouter, prefix: "/api/location" }, 
  { router: MVARouter, prefix: "/api/mva"}
]; 

routerPrefixes.forEach(({ router, prefix }) => {
  router.stack.forEach((layer) => {
    if (layer.route) {
      validRoutes.add(prefix + layer.route.path); 
      routeRegex.push(pathToRegexp(prefix + layer.route.path).regexp);
    } 
  }); 

}); 

console.log([...validRoutes]);  
console.log([...routeRegex])
app.listen(PORT, ()=>{
    console.log(`Express server running at http://localhost:${PORT}/`)
})  



  