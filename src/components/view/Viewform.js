import Form from '../form/Form';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export default  (props) =>{

  const params=useParams()

   const [data,setData]=useState(
     {
       "id":1,
       "name":"Attendance",
       "user":"vamshi",
       "description":"19-08-2021",
       "feilds":[
         {
           "fid":1,
           "title":"Roll No",
           "required":true,
           "type":1
         },
         {
           "fid":2,
           "title":"Name ",
           "required":true,
           "type":1
         },
          {
           "fid":3,
           "title":"Section ",
           "required":false,
           "type":2,
           "multiple":true,
           "options":[
               {
                   "oid":1,
                   "option":"A"
               },
               {
                   "oid":2,
                   "option":"B"
               },
               {
                   "oid":3,
                   "option":"C"
               },
           ]
         },
       ]
     }
  )

  return (
    <div style={{backgroundColor:"#f0ebf8"}}>
      <Form data={data}/>
      <div>
      {params.id}
      </div>
    </div>
  );
}
