import Form from '../form/Form';


function View (props){
    
   
     var id=props.match.params.id

      return (
        <div>
          <Form id={id}></Form>
        </div>
          );
}

export default  View;