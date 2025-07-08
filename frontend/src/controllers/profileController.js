
export default class ProfileController{
       constructor(headers){
        this.headers =  headers; 
       }
      async getProfile(userType){ 
       try{ 
        console.log("get profile called");
         const resp =  await fetch(`/api/profile/getProfile?userType=${userType}`,
           {
             method: 'GET', 
             headers: this.headers
           }
         )  
         const profile = await resp.json();  
         return profile;  
        } 
        catch(err){
              return new Error(err.message); 
        }
         
     } 
     async updateProfile(data){  
          const resp = await fetch("/api/profile/updateProfile",
            {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            }
          ) 
          const result = await resp.json(); 
          return result; 
    }
}