import { useEffect, useState } from "react"
import "../form/Form.css"
import axios from 'axios';
import { url } from "../server";
import  {randomBytes} from "crypto"
import "./response.css"
 
export default (props)=>{
   
    var [data,setData]=useState({})

    var id=props.match.params.id
    var rp=props.match.params.rid


     useEffect(()=>{
        getData()
     },[id])

    async function getData() {
      var rpk=await axios.post(url+"/getresp",{"formid":id+"","respid":rp+""})
      setData({...rpk.data})
        console.log(rpk.data)

   }


    return (
        <div className="base">
                {Object.keys(data).length>0 &&

            <div className="inner">
              <div className="top">
                <span id="title">{data.name}</span>
                <span id="desp">{data.description}</span>
                <span>{data.ruser}</span>
              </div>

              {data.feilds.map((feild)=>{
                  return (
                      <div className="feild" key={feild.fid}>
                         <label ><span style={{fontWeight:"bold"}}>{feild.title}</span>
                         <div className="reval"> 
                             {
                             feild.type===1?
                                 <span >{feild.value}</span>
                             :feild.type===2?
                                <div id={"f"+feild.fid}>
                                   {feild.options.map((option)=>{
                                       if(option.oid==feild.oid){
                                       return (
                                               <label>
                                                    <span >{option.option}</span>
                                               </label>
                                       )}
                                   })}
                                </div>
                             :<div></div>
                             }
                         </div>
                         </label>
                         <div className="clr" ><span id={"clr"+feild.fid}>Clear Response</span></div>
                      </div>
                  )
              })}
           
            </div>
}
       </div>
    )
}