import { useEffect, useState } from "react"
import "./Form.css"
import axios from 'axios';
import { cid, url } from "../server";
import  {randomBytes} from "crypto"
import GoogleLogin, { GoogleLogout } from "react-google-login";

 
export default (props)=>{
   
    var [data,setData]=useState({})
    var [resp,setResp]=useState({})
    var [login,setLogin]=useState(false)
    var [user,setUser]=useState({})


    var id=props.id

     useEffect(()=>{
        getData(id)

     },[id])


    async function getData(id) {
      console.log("started")
      var res=await axios.post(url+"/get",{"formid":id+""})
      var con=res.data
      setData({...con})
      setResp({...{"respid":randomBytes(5).toString("hex"),"formid":con.formid,"responses":[]}})
   }
   

    const onFeildInput=(e,feild,value)=>{
      var r=resp;
      var res= r.responses.filter(ele=>ele.fid!=feild.fid)||[]
      if(feild.type===1){
         res.push({"fid":feild.fid,"response":e.target.value})
      }
      if(feild.type === 2){
          if(feild.multiple){
            let v=r.responses.filter(ele=>ele.fid==feild.fid)
            if(v.length>0){
                v=v[0]
                res.push({"fid":feild.fid,"response":[...v.response,e.target.name]})
            }
            else{
                 res.push({"fid":feild.fid,"response":[e.target.name]})
            }
          }
          else{
              res.push({"fid":feild.fid,"response":value,"oid":e.target.name})   
            }
      }
      handle(e,feild)
      r.responses=res
      setResp(r)
    }

    async function submit(e){
      if(login){
      var v=resp
      v["user"]=user.email
      var res=await axios.post(url+"/addresp",v)
      var con=res.data
      if(con.insertedCount>0){
          window.location.reload(false);
      }
    }
    else{
        var r = document.querySelector(':root');
        var gl = document.querySelector('.glogin');
        var rs = getComputedStyle(r);
        var c=rs.getPropertyValue('--border-top-color')
        r.style.setProperty('--border-top-color', 'red');
        gl.classList.toggle("err")
        setTimeout(()=>{
            r.style.setProperty('--border-top-color', c);
            gl.classList.toggle("err") 
        },2000)
        
    }
    }

    const handle=(e,feild)=>{
        let c=document.querySelector("#clr"+feild.fid)
        if(feild.type==1){
          if(e.target.value.length > 0){
              c.classList.add("clear")
         }
         else{
          c.classList.remove("clear")
         }
        }
        else if(feild.type==2){
           let lab=document.querySelectorAll("#f"+feild.fid+">label>input")
           lab=[...lab]
           if(lab.filter(ele=>ele.checked==true).length >0 ){
                  c.classList.add("clear")
           }
           if(!feild.multiple){
                lab.forEach(ele=>{
                    if(ele!=e.target){
                        ele.checked=false
                    }
                })
           }
        }
    }
    const clearFeild=(e,feild)=>{
          let c=document.querySelector("#f"+feild.fid)
          if(feild.type==1){
              c.value=""
              document.querySelector("#clr"+feild.fid).classList.remove("clear")
          }
          else if(feild.type==2){
                let lab=document.querySelectorAll("#f"+feild.fid+">label>input")
                lab=[...lab]
                lab.forEach(ele=>ele.checked=false)
                document.querySelector("#clr"+feild.fid).classList.remove("clear")
          }
    }

    function loginsuccess(response){
        setLogin(true)
        setUser(response.profileObj)
    }

    function loginfailure(response){
        console.log(response)
    }

    function logoutsuccess(response){
        setLogin(false)
        setUser({})
    }

    function logoutfailure(response){
        console.log(response)
    }

    return (
        <div className="base">
                {Object.keys(data).length>0 &&

            <div className="inner">
              <div className="top">
                <span id="title">{data.name}</span>
                <span id="desp">{data.description}</span>
                {!login&&
                <div 
                  className="glogin"
                >
                <GoogleLogin
                  clientId={cid}
                  buttonText="login with google"
                  cookiePolicy={"single_host_origin"}
                  onSuccess={loginsuccess}
                  onFailure={loginfailure}
                ></GoogleLogin>
                </div>
                }
                {login&&<div>
                    <div className="uname">{user.email}</div>
                     <GoogleLogout
                  className="glogin"
                  clientId={cid}
                  buttonText="logout"
                  cookiePolicy={"single_host_origin"}
                   onLogoutSuccess={logoutsuccess}
                ></GoogleLogout></div>
                    }
               
              </div>
              {data.feilds.map((feild)=>{
                  return (
                      <div className="feild" key={feild.fid}>
                         <label>{feild.title}
                         <div>
                             {
                             feild.type===1?
                                 <input  type="text" name={feild.fid} id={"f"+feild.fid} onChange={(e)=> onFeildInput(e,feild,"")}/>
                             :feild.type===2?
                                <div id={"f"+feild.fid}>
                                   {feild.options.map((option)=>{
                                       return (
                                               <label>
                                                    <input type="radio" name={option.oid}  onChange={(e)=> onFeildInput(e,feild,option.option)}/>
                                                    <span>{option.option}</span>
                                               </label>
                                       )
                                   })}
                                </div>
                             :<div></div>
                             }
                         </div>
                         </label>
                         <div className="clr" ><span onClick={(e)=>clearFeild(e,feild)} id={"clr"+feild.fid}>Clear Response</span></div>
                      </div>
                  )
              })}
            <div className="subcon">  
                <button id="submit" onClick={submit}>submit</button>
            </div>
            </div>
}
       </div>
    )
}