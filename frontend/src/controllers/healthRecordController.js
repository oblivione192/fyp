

export default class HealthRecordController{ 
     constructor(headers){
        this.headers = headers; 
     }

     async getHealthRecord(){
        const response = await fetch("/api/health/getHealthRecord",
            {
                method:'GET',
                headers:this.headers
            }
         )
         const result =  await response.json(); 
         return result[0]; 

    } 
     async addHealthRecord(data){ 
        //blood_type, diagnosis, notes, height, weight
        const response = await fetch("/api/health/addRecord",
            {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            }
        )
        const result = await response.json(); 
        return result; 
    }
     async updateHealthRecord(updateData){
        const response = await fetch("/api/health/updateRecord",
            {
               method: 'POST',
               headers: this.headers,
               body: JSON.stringify(updateData)
            }
        ) 
        const result = await response.json(); 
        return result; 
    }
     async deleteHealthRecord(){
        const response = await fetch("/api/health/deleteRecord",
            {
                method: 'POST',
                headers:this.headers
            }
        ) 
        const result =  await response.json(); 
        return result; 
    } 

}