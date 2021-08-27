import Form from '../form/Form';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default  (props) =>{

  const params=useParams()



   const [data,setData]=useState({})

   axios.post("https://myserver1107.herokuapp.com/form/get",{"formid":params.id}).then(res=>{
            setData({...res.data})
    })

  return (
    <div style={{backgroundColor:"#f0ebf8"}}>
      <Form data={data}/>
      <div>
      {params.id}
      </div>
    </div>
  );
}
