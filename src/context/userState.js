import { useState } from "react";
import userContext from "./userContext";


const UserState=(props)=>{

    const [user,setUser]=useState({"login":false,"info":{}})

    function update(u){
        setUser({...u})
    }

    return(
        <userContext.Provider value={{user,update}}>
           {props.children}
        </userContext.Provider>
    )
}

export default UserState