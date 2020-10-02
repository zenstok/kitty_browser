import React, {Component} from 'react';
import {DrizzleProvider} from 'drizzle-react'
import Loading from './containers/Loading';
import Browser from './components/Browser';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


class App extends Component {
    render() {
        const drizzleOptions = {
            contracts: []
        };

        function Home() {
            return <h2>This is the homepage</h2>
        }

        function Kitty() {
            return <DrizzleProvider options={drizzleOptions}>
                <Loading>
                    <Browser/>
                </Loading>
            </DrizzleProvider>
        }

        return (
            <Router>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/kitty">Kitty</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/kitty">
                        <Kitty/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
