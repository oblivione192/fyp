import express from 'express' 
const app = express();  

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./build'))  


export default app; 