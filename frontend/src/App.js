import * as React from 'react';
import {BrowserRouter, Route,Routes} from 'react-router-dom'; 
import Login from './Login';
import Register from './Register'; 
import Entrance from './Entrance';
import HomePage from './MainMenu';
function App(){    
  return(  
   <BrowserRouter>  
    <Routes>    
      <Route path="/home" element={<HomePage/>}/> 
      <Route path="/" element={<Entrance/>}> 
        <Route path="/login" element={<Login/>}/> 
        <Route path="/register" element={<Register/>}/>   
      </Route>
    </Routes>
   </BrowserRouter>
  )
}

export default App;
