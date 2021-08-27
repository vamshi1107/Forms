import Create from "../create/Ck"
import {useState} from 'react'
import axios from 'axios'
import  {randomBytes} from "crypto"


export default (props)=>{
    const [data,setData]=useState({"formid":randomBytes(7).toString("hex"),"name":"","description":"","feilds":[]})

    const setForm=(data)=>{
        setData(data)
        console.log("saved")
        axios.post("https://myserver1107.herokuapp.com/form/add",data).then(res=>{
            console.log(res)
        })
    }

    return (
        <div>
            <Create data={data} setForm={setForm}/>
        </div>
    )
}