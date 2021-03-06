import {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import  {randomBytes} from "crypto"
import { url } from '../server'
import "./edit.css"
import { Link,useHistory } from "react-router-dom"
import userContext from '../../context/userContext'
import {Chart} from "react-google-charts"

export default (props)=>{

    const [data,setData]=useState({})
    const [resp,setRep]=useState([])
    let history=useHistory()

    const us=useContext(userContext)

    const user=us.user

    checkLog()

    window.onload=(e)=>{
       checkLog()
    }

     function checkLog(){
       if(window.localStorage.getItem("login")!=null){
             if(eval(window.localStorage.getItem("login"))){
                 user.login=true
                 user.info=JSON.parse(window.localStorage.getItem("info"))
             }
             else{
                 user.login=false
                 history.push("/") 
             }
       }
       else{
           window.localStorage.setItem("login","false")
           history.push("/")
       }
    }

    useEffect(()=>{
         axios.post(url+"/get",{"formid":props.match.params.id,"user":user.info.email}).then(res=>{
            var con=res.data
            setData({...con})
        })

    },[])

     useEffect(()=>{
        getResponses()
    },[])

    const getResponses=()=>{
        setInterval(() => {
             axios.post(url+"/showresp",{"formid":props.match.params.id}).then(res=>{
                var c=res.data
                c=Array.from(c)
                setRep(c)
        })
        }, 3000);
        
    }

    const setForm=(data)=>{
        setData(data)
        axios.post(url+"/add",data).then(res=>{
          
        })
        return  true
    }

    const DataHandler=(e)=>{
         let d=data
         d[e.target.name]=e.target.value
         setData({...d})
    }

    const AddFeild=(e,type)=>{
        var n={"fid":randomBytes(5).toString("hex"),"title":"","type":type,"required":false}
        if(type===2){
            n["options"]=[]
        }
        let r=data
        r.feilds.push(n)
        setData({...r})        
    }

    const changeReq=(e,fid)=>{
          let k=data
          k.feilds.map(ele=>{
            if(ele.fid===fid){
                ele.required=e.target.value==="on"
            }
        })
        setData({...k})
    }

    const addOption=(e,n)=>{
        let o= {"oid":randomBytes(3).toString("hex"),"option":""}
        let k=data
        k.feilds.map((feild)=>{
            if(feild.fid===n.fid){
                feild.options.push(o)
            }
        })
        setData({...k})
    }

    const optionChange=(e,fid,oid)=>{
        let n=data
        n.feilds.map((feild)=>{
            if(feild.fid===fid){
                feild.options.map(op=>{
                    if(op.oid===oid){
                      op.option=e.target.value
                    }
                })
            }
        })
        setData({...n})
    }

    const removeFeild=(id)=>{
        let k=data
        k.feilds=k.feilds.filter(ele=>ele.fid!==id)
        setData({...k})
    }

     const removeOption=(fid,oid)=>{
        let k=data
        for(let i of k.feilds){
            if(i.fid==fid){
                i.options= i.options.filter(e=>e.oid!=oid)
            }
        }
    }

    const onOpChange=(e,fid)=>{
        let k=data
        let v=e.target.value
        k.feilds.map(ele=>{
            if(ele.fid===fid){
                ele.title=v
            }
        })
        setData({...k})
    }
    const save=async (e)=>{
        if(data.name!=""){
            var v=await setForm(data)
            if(v){
                var but=document.getElementById("savebut")
                var c=but.innerText
                var co=but.style.backgroundColor
                but.style.backgroundColor="white"
                but.innerText="Saved"
                setTimeout(()=>{
                     but.style.backgroundColor=co
                     but.innerText=c
                },1000)
            } 
        }
        else{
            alert("Name should not be none")
        }
    }

     async function remove(e,id){
         var v=await window.confirm("Do you want to delete form?")
         if(v){
            var form={"formid":id}
            axios.post(url+"/remove",form).then(res=>{
                var status=res.data
                if (status){
                history.push("/")
                }
            })
        }
   }

    function showResponses(e,formid){
       history.push("/showresponses/"+formid)
    }

    const frequency=(r)=>{
        var counts={}
        for (const num of r) {
                    counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        return counts
    }

    const getChart=(feild)=>{
        var fid=feild.fid
        var r=[]
        var v
        for(let i of resp){
                v=i["responses"].find(ele=>ele.fid==fid)
                if(v!=undefined){
                    r.push(v)
                }
        }
        r=r.map(ele=>[ele.response.toLowerCase()])
        var ans=[["response","Count"]]
        var counts=frequency(r)
        for(let i of Object.keys(counts)){
                    ans.push([i,counts[i]])
        }
        var type=feild.type==2?"PieChart":"Bar"
        if(ans.length>1){
                return (
                    <Chart
                            width={600}
                            height={'350px'}
                            chartType={type}
                            loader={<div>Loading Chart</div>}
                            data={ans}
                            options={{
                                vAxis: { title: 'response', titleTextStyle: { color: '#333' } },
                                hAxis: { minValue: 0 },
                            }}
                        
                            />
                     )
                }
        
    }

    const statsPage=()=>{
        return (
            <>
                {data.feilds.filter(ele=>ele.type==2).map((feild)=>{
                  return (
                      <div className="feild" key={feild.fid}>
                         <label><span style={{fontWeight:"bold"}}>{feild.title}</span>
                         <div className="chart"> 
                             {
                                 getChart(feild)
                             }
                         </div>
                         </label>
                      </div>
                  )
              })}
            </>
        )
    }
    
    return (
        <div className="base">
            {Object.keys(data).length>0&&
            <div className="inner">
            
              <div className="top" style={{"width":"100%","margin":"10px auto"}}>
                <span id="title"><input onChange={DataHandler}  name="name" type="text" placeholder="Name" autoComplete="off" value={data.name}/></span>
                <span id="desp"><input onChange={DataHandler} name="description" type="text" placeholder="Description" autoComplete="off" value={data.description}/></span>
              </div>
            <div id="oplist" >
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
               <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                     Form
                     </button>
               </li>
               <li className="nav-item" role="presentation">
                     <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                       Responses
                    </button>
                </li>
                 <li className="nav-item" role="presentation">
                     <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-stats" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                       Statistics
                    </button>
                </li>
            </ul>
            </div>
           <div className="tab-content" id="pills-tabContent">
               <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">

              <div id="adder">
                  <button onClick={(e)=>AddFeild(e,1)} className="addbut">+Add Input</button>
                   <button onClick={(e)=>AddFeild(e,2)} className="addbut">+Add Choice</button>
                   <button onClick={(e)=>remove(e,data.formid)} className="addbut">Delete from</button>
                   <button className="addbut"><a className="addbut" href={"/viewform/"+data.formid} target="/" onClick={save}>Open</a></button>
                   <button id="savebut" onClick={(e)=>save(e)}>Save</button>
              </div>
           
                   {data.feilds.map((feild)=>{
                  return (
                      <div className="feild" id={"feild"+feild.fid}>
                         <label><input placeholder="Enter title" value={feild.title} onInput={(e)=>{onOpChange(e,feild.fid)}} onChange={(e)=>{onOpChange(e,feild.fid)}} />
                         <div>
                             {
                             feild.type===1?
                                 <input type="text" />
                             :feild.type===2?
                                <div id={"f"+feild.fid} className="opcon" >
                                   <div  onClick={(e)=>{addOption(e,feild)}} className="addbut">+ Add Option</div>
                                   {feild.options.map((option)=>{
                                       return (
                                        <div>
                                            <label>
                                                    <input type="radio" name={option.oid}/>
                                                    <input onChange={(e)=>optionChange(e,feild.fid,option.oid)} type="text" value={option.option}></input>
                                            </label>
                                            <span onClick={(e)=>{removeOption(feild.fid,option.oid)}}>Remove</span>
                                        </div>
                                       )
                                   })}
                                </div>
                             :<div></div>
                             }
                         </div>
                         </label>
                         <div className="bottom">
                             <button onClick={()=>removeFeild(feild.fid)}>Remove</button>
                             <input type="checkbox" onChange={(e)=>{changeReq(e,feild.fid)}}></input>
                         </div>
                      </div>
                  )
                   })}
               </div>
              <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                  <div className="respcon">
                 {resp.length>0 && resp.map(r=>{
                     return (
                         <div className="response">
                           <Link to={"/showresponse/"+r.formid+"/"+r.respid}>{r.ruser}</Link>
                         </div>
                     )
                 })}
                 </div>
              </div>
             <div className="tab-pane fade" id="pills-stats" role="tabpanel" aria-labelledby="pills-profile-tab">
                  {statsPage()}
              </div>
            </div>
            
            </div>
         }

        </div>
    )

}