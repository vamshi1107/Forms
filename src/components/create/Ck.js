import { useState,useEffect } from "react"
import "./Create.css"
import  {randomBytes} from "crypto"

export default (props)=>{

    const pd=props.data
    const [data,setData]=useState(pd)
    var dt=data;

    useEffect(()=>{
        setData(dt)
    },[dt])

    const DataHandler=(e)=>{
         let d=data
         d[e.target.name]=e.target.value
         setData({...d})
    }

    const AddFeild=(e,type)=>{
        var n={"fid":randomBytes(5).toString("hex"),"title":"","type":type,"required":false}
        if(type==2){
            n["options"]=[]
        }
        let r=data
        r.feilds.push(n)
        setData({...r})        
    }

    const changeReq=(e,fid)=>{
          let k=data
          k.feilds.map(ele=>{
            if(ele.fid==fid){
                ele.required=e.target.value=="on"
            }
        })
        setData({...k})
    }

    const addOption=(e,n)=>{
        let o= {"oid":randomBytes(3).toString("hex"),"option":""}
        let k=data
        k.feilds.map((feild)=>{
            if(feild.fid==n.fid){
                feild.options.push(o)
            }
        })
        setData({...k})
    }

    const optionChange=(e,fid,oid)=>{
        let n=data
        n.feilds.map((feild)=>{
            if(feild.fid==fid){
                feild.options.map(op=>{
                    if(op.oid==oid){
                      op.option=e.target.value
                    }
                })
            }
        })
        setData({...n})
    }

    const removeFeild=(rem,id)=>{
        var inner=document.querySelector(".inner")
        var node;
        inner.childNodes.forEach(ele=>{
            if(ele.id==rem){
               node=ele
            }
        })
        inner.removeChild(node)
        let k=data
        k.feilds=k.feilds.filter(ele=>ele.fid!=id)
        setData({...k})
    }

    const onOpChange=(e,fid)=>{
        let k=data
        let v=e.target.value
        k.feilds.map(ele=>{
            if(ele.fid==fid){
                ele.title=v
            }
        })
        setData({...k})
    }
    const save=(e)=>{
        console.log(data)
        props.setForm(data)
    }
    
    return (
        <div className="base">
            <div className="inner">
              <div className="top">
                <span id="title"><input onChange={DataHandler}  name="name" type="text" placeholder="Name" autoComplete="off"/></span>
                <span id="desp"><input onChange={DataHandler} name="description" type="text" placeholder="Description" autoComplete="off"/></span>
              </div>
              <div id="adder">
                  <button onClick={(e)=>AddFeild(e,1)} className="addbut">+Add Input</button>
                   <button onClick={(e)=>AddFeild(e,2)} className="addbut">+Add Choice</button>
                   <button id="savebut" onClick={(e)=>save(e)}>Save</button>
              </div>
               {data.feilds.map((feild)=>{
                  return (
                      <div className="feild" id={"feild"+feild.fid}>
                         <label><input placeholder="Enter title"  onInput={(e)=>{onOpChange(e,feild.fid)}} onChange={(e)=>{onOpChange(e,feild.fid)}} />
                         <div>
                             {
                             feild.type===1?
                                 <input type="text" />
                             :feild.type===2?
                                <div id={"f"+feild.fid} className="opcon" >
                                   <div  onClick={(e)=>{addOption(e,feild)}} className="addbut">+ Add Option</div>
                                   {feild.options.map((option)=>{
                                       return (
                                               <label>
                                                    <input type="radio" name={option.oid}/>
                                                    <input onChange={(e)=>optionChange(e,feild.fid,option.oid)} type="text"></input>
                                               </label>
                                       )
                                   })}
                                </div>
                             :<div></div>
                             }
                         </div>
                         </label>
                         <div className="bottom">
                             <button onClick={()=>removeFeild("feild"+feild.fid,feild.fid)}>Remove</button>
                             <input type="checkbox" onChange={(e)=>{changeReq(e,feild.fid)}}></input>
                         </div>
                      </div>
                  )
              })}
            </div>
        </div>
    )

}