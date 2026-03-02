
export default async function distance(lat1,lon1,lat2,lon2){ 
      
    console.log(`Calculating distance between (${lat1},${lon1}) and (${lat2},${lon2})`);  
    
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${lat1},${lon1}&` +
        `destinations=${lat2},${lon2}&` +
        `mode=driving&` +   
        `units=imperial&` +
        `key=${process.env.GOOGLE_MAP_API_KEY}`
        ); 

    const result = await response.json();      
    if(result.status != "OK") return {error:"Something went wrong"}; 
    return result.rows[0].elements[0].distance.value;    
    
}






