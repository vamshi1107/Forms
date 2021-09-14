import {useEffect, useState} from 'react'
import axios from 'axios'
import  {randomBytes} from "crypto"
import "./home.css"
import { Link,useHistory } from "react-router-dom"
import { url } from "../server"




export default (props)=>{
    const [forms,setForms]=useState([])

    let history = useHistory();
 

    useEffect(()=>{
       getForms(1)
    },[])


    async function getForms(id) {
      var res=await axios.post(url+"/getall",{"formid":id+""})
      var con=res.data
      setForms(con)
      console.log(forms)
   }

   function create(){
       var id=randomBytes(8).toString("hex")
       var form={"formid":id,"feilds":[]}
        console.log(form)
        axios.post(url+"/add",form).then(res=>{
            var status=res.data.status
            if (status===1 || status === 2){
               history.push("/editform/"+id)
            }
        })
   }

  

    return (
        <div>
            <div className="formcon">
                <div  className="form" onClick={create}>Create</div>
            {forms.length>0 &&
                forms.map(ele=>{
                     return(
                            <Link to={"editform/"+ele.formid}>
                               <div key={ele.formid} className="form">
                                      <div>{ele.name}</div>
                                </div>
                           </Link>

                   ) 
               })
             }
             
            </div>
            
           
        </div>
    )
}