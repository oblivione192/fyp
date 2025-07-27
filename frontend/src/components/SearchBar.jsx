import { IoMdSearch } from "react-icons/io"; 
import { FormControl } from "react-bootstrap";
import { useState} from "react";
export default function SearchBar({changeHandler,placeholder}){
     return(
        <>  
           <IoMdSearch className="icon"/> 
           <FormControl xs={8}
            onChange={(e)=>{changeHandler(e.target.value)}}
            type="text" placeholder={placeholder}/>  
        </>
     )
}