import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import { BrowserRouter } from 'react-router-dom';
import Viewform from './components/view/Viewform';
import Create from './components/create/Create';




function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={Home}></Route>
        <Route path="/viewform/:id" component={Viewform}></Route>
      </Switch>
     </BrowserRouter>
  );
}

export default App;
