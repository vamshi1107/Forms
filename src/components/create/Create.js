import { useState,useEffect } from "react"
import "./Create.css"
import  {randomBytes} from "crypto"

export default (props)=>{

    const pd=props.data
    const [data,setData]=useState(pd)


    const DataHandler=(e)=>{
         let d=data
         d[e.target.name]=e.target.value
         setData(d)
    }

    const AddFeild=(e,type)=>{
        var n={"fid":randomBytes(5).toString("hex"),"title":"","type":type,"required":false}
        if(type==2){
            n["options"]=[]
        }
        let r=data
        r.feilds.push(n)
        setData(r) 
        addElement(e,n,type)
    }

    const addElement=(e,n,type)=>{
        var inner=document.querySelector(".inner")
        let feild=document.createElement("div")
        feild.className="feild"
        feild.id="feild"+n.fid
        let label=document.createElement("label")
        if(type===1){
           let inp=document.createElement("input")
           let til=document.createElement("input")
            inp.type="text" 
            inp.name=n.fid 
            inp.id="f"+n.fid
            til.placeholder="Enter title"
            label.appendChild(til)
            til.oninput=(e)=>{onOpChange(e,n.fid)}
            label.appendChild(document.createElement("div").appendChild(inp))
            feild.appendChild(label)
        }
        else if(type==2){
             let op=document.createElement("div")
             op.id=n.fid
             op.className="opcon"
             let but=document.createElement("span")
             but.textContent="+ Add Option"
             but.onclick=(e)=>{addOption(e,n,feild)}
             let tit=document.createElement("input")
             tit.placeholder="Enter title"
             tit.onchange=(e)=>{onOpChange(e,n.fid)}
             tit.oninput=(e)=>{onOpChange(e,n.fid)}
             feild.appendChild(tit)
             feild.appendChild(but)
             feild.appendChild(op)
        }
         let check=document.createElement("input")
         let bot=document.createElement("div")
         bot.className="bottom"
         check.type="checkbox"
         check.name="check"
         check.onchange=(e)=>{changeReq(e,n.fid)}
         let rem=document.createElement("button")
         rem.textContent="Remove"
         rem.onclick=()=>removeFeild(feild.id,n.fid)
         bot.appendChild(rem)
         bot.appendChild(check)
         feild.appendChild(bot)
         inner.appendChild(feild)
    }

    const changeReq=(e,fid)=>{
          let k=data
          k.feilds.map(ele=>{
            if(ele.fid==fid){
                ele.required=e.target.value=="on"
            }
        })
        setData(k)
    }

    const addOption=(e,n,feild)=>{
        let o= {"oid":randomBytes(3).toString("hex"),"option":""}
        let op=document.getElementById(n.fid)
        let option=document.createElement("label")
        let opin=document.createElement("input")
        let opdis=document.createElement("input")
        opin.type="radio"
        opdis.type="text"
        opdis.onchange=(e)=>optionChange(e,n.fid,o.oid)
        option.appendChild(opin)
        option.appendChild(opdis)
        op.appendChild(option)
        let k=data
        k.feilds.map((feild)=>{
            if(feild.fid==n.fid){
                feild.options.push(o)
            }
        })
        setData(k)
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
        setData(n)
        console.log(data)
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
        setData(k)
    }

    const onOpChange=(e,fid)=>{
        let k=data
        let v=e.target.value
        k.feilds.map(ele=>{
            if(ele.fid==fid){
                ele.title=v
            }
        })
        setData(k)
    }
    const save=(e)=>{
        console.log(data)
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
                  console.log(feild)
                  return (
                      <div className="feild">
                         <label><input placeholder="Enter title"  onInput={(e)=>{onOpChange(e,feild.fid)}}/>
                         <div>
                             {
                             feild.type===1?
                                 <input type="text" />
                             :feild.type===2?
                                <div id={"f"+feild.fid}>
                                   {feild.options.map((option)=>{
                                       return (
                                               <label>
                                                    <input type="radio" name={option.oid}/>
                                                    <span>{option.option}</span>
                                               </label>
                                       )
                                   })}
                                </div>
                             :<div></div>
                             }
                         </div>
                         </label>
                         <div className="bottom">
                             <button>Remove</button>
                             <input type="checkbox"></input>
                         </div>
                      </div>
                  )
              })}
            </div>
        </div>
    )

}