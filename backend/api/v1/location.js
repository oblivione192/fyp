import express from 'express';  
import fetch from 'node-fetch'; 
const locationRouter = express.Router();
locationRouter.get("/getLocationName",async(req,res)=>{     
      const { latitude, longitude } = req.query; 
        if(!latitude || !longitude){                
            return res.status(400).json({error:"Missing latitude or longitude"}); 
        } 
        try{ 
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}`+
            `&key=${process.env.GOOGLE_MAP_API_KEY}`); 
            const data = await response.json(); 
            if(data.status !== "OK"){        
                console.log(data);   
                return res.status(500).json({error:"Failed to fetch location name"});
            }       

            const locationName = data.results[0]?.formatted_address || "Unknown location";  

            return res.json({locationName});
        }

        catch(err){             
            console.error(err); 
            return res.status(500).json({error:"Internal server error"}); 
        }
})   

locationRouter.get("/getLocationCoordinates",async(req,res)=>{
     const {locationName} = req.query; 
     
     const url =  `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}}&key=${process.env.GOOGLE_MAP_API_KEY}` 
     const response = await fetch(url); 

     const data = await response.json(); 
     const { lat, lng } = data.results[0].geometry.location; 

     return res.json({lat: lat, lng: lng})
} )

export default locationRouter;