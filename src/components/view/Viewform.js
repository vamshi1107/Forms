import Form from '../form/Form';
import { useState, useEffect, useCallback} from 'react';
import axios from 'axios';


function View (props){
    
   
     var id=props.match.params.id

      return (
        <div>
          <Form id={id}></Form>
        </div>
          );
}

export default  View;