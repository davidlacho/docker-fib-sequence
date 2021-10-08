import './App.css';
import Fib from "./Fib";
import OtherPage from "./OtherPage";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

function App() {
    return (
        <>
            <Router>
                <header>
                    <Link to="/">Home</Link>
                    <Link to="/otherpage">Other Page</Link>
                </header>
                <Switch>
                    <Route exact path="/"><Fib/></Route>
                    <Route exact path="/otherpage"><OtherPage/></Route>
                </Switch>

            </Router>
        </>
    );
}

export default App;
