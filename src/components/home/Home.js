import Create from "../create/Ck"
import {useState} from 'react'

export default (props)=>{
    const [data,setData]=useState({"name":"","description":"","feilds":[]})

    const setForm=(data)=>{
        setData(data)
        console.log("saved")
    }

    return (
        <div>
            <Create data={data} setForm={setForm}/>
        </div>
    )
}