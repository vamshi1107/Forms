import {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import  {checkPrime, randomBytes} from "crypto"
import "./home.css"
import { Link,useHistory } from "react-router-dom"
import { url,cid } from "../server"
import userContext from '../../context/userContext'
import GoogleLogin from "react-google-login";



export default (props)=>{
    const [forms,setForms]=useState([])

    let history = useHistory();
    
    const us=useContext(userContext)

    const user=us.user

    checkLog()

    window.onload=(e)=>{
       checkLog()
    }


    useEffect(()=>{
        checkLog()
       getForms() 
    },[])

    function checkLog(){
       if(window.localStorage.getItem("login")!=null){
             if(eval(window.localStorage.getItem("login"))){
                 user.login=true
                 user.info=JSON.parse(window.localStorage.getItem("info"))
             }
             else{
                 user.login=false
             }
       }
       else{
           window.localStorage.setItem("login","false")
       }
    }


    async function getForms() {
        if (user.login && user.info){
            var id=user.info.email
            var res=await axios.post(url+"/getbyEmail",{"user":id+""})
            var con=res.data
            setForms(con)
        }
        else{

        }
    
      console.log(forms)
   }

   function create(){
       var id=randomBytes(8).toString("hex")
       var form={"formid":id,"feilds":[],"user":user.info.email}
        console.log(form)
        axios.post(url+"/add",form).then(res=>{
            var status=res.data.status
            if (status===1 || status === 2){
               history.push("/editform/"+id)
            }
        })
   }

  
    function loginsuccess(response){
        var uk=user
        uk.login=true
        uk.info=response.profileObj
        us.update(uk)
        window.localStorage.setItem("login","true")
        window.localStorage.setItem("info",JSON.stringify(response.profileObj))
        window.location.reload(false)
    }

    function loginfailure(response){
        console.log(response)
    }

    function Logout(){
        var uk=user
        uk.login=false
        uk.info={}
        us.update(uk)
        window.localStorage.setItem("login","false")
        window.localStorage.setItem("info",JSON.stringify({}))
    }


    return (
        <div>
            {user.login&& 
            <div className="afterpage">
               <div className="pagetop">
                     <div className="userpic ">
                         <img src={user.info.imageUrl} height="100%" width="100%"></img>
                     </div>
                    <button onClick={Logout} className="outbut">Logout</button> 
               </div>

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

            }
            {!user.login&&
               <div className="page">
                   <div className="gbutt">
                        <GoogleLogin
                            clientId={cid}
                            buttonText="login with google"
                            cookiePolicy={"single_host_origin"}
                            onSuccess={loginsuccess}
                            onFailure={loginfailure}
                            ></GoogleLogin>
                   </div>
                  
               <lottie-player src="https://assets2.lottiefiles.com/temp/lf20_jJxas0.json" 
                      background="transparent" speed="1"
                      style={{width:"70vw", height:"80vh"}} 
                      loop autoplay>
                </lottie-player>

               </div>
            }
           
        </div>
    )
}