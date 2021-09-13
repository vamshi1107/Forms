import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import { BrowserRouter } from 'react-router-dom';
import Viewform from './components/view/Viewform';
import Edit from './components/edit/Edit';
import Response from './components/response/response';




function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={Home}></Route>
        <Route path="/viewform/:id" component={Viewform}></Route>
        <Route path="/editform/:id" component={Edit}></Route>
        <Route path="/showresponse/:id/:rid" component={Response}></Route>
      </Switch>
     </BrowserRouter>
  );
}

export default App;
