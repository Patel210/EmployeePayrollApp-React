import './App.css';
import PayrollForm from './components/PayrollForm/PayrollForm';
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect
} from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/payroll-form"> 
            <PayrollForm />  
          </Route>
          <Route exact path=""> 
            <HomePage />  
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
